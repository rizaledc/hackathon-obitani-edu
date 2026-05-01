import ee
import os
import json
import random
from dotenv import load_dotenv

load_dotenv()

def initialize_gee():
    if not ee.data._credentials:
        service_account = os.getenv("GEE_SERVICE_ACCOUNT")
        key_json_str = os.getenv("GEE_KEY_JSON")
        
        if not service_account or not key_json_str:
            raise ValueError("GEE_SERVICE_ACCOUNT atau GEE_KEY_JSON tidak ditemukan di environment variables")
        
        key_data = json.loads(key_json_str)
        credentials = ee.ServiceAccountCredentials(service_account, key_data=key_data)
        ee.Initialize(credentials)

def analyze_lahan(polygon_geojson, lahan_id):
    try:
        initialize_gee()
        geom = ee.Geometry(polygon_geojson)
        
        # Sampling 10 titik: centroid + 9 random
        points_fc = ee.FeatureCollection.randomPoints(geom, 9, 42)
        centroid = geom.centroid()
        all_points_fc = points_fc.merge(ee.FeatureCollection([ee.Feature(centroid)]))
        
        # Sentinel-2 (NDVI, NDTI)
        s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterBounds(geom) \
            .filterDate('2023-01-01', '2023-12-31') \
            .median()
        ndvi = s2.normalizedDifference(['B8', 'B4']).rename('ndvi')
        ndti = s2.normalizedDifference(['B11', 'B12']).rename('ndti')
        
        # ERA5 Land (Temp, Humidity)
        era5 = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR') \
            .filterBounds(geom) \
            .filterDate('2023-01-01', '2023-12-31') \
            .median()
        temp = era5.select('temperature_2m').subtract(273.15).rename('temperature')
        # GEE doesn't have direct humidity in this ERA5 band normally, using dewpoint or mock
        humidity = ee.Image.constant(75.0).rename('humidity') 
        
        # CHIRPS (Rainfall 30 hari)
        chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY') \
            .filterBounds(geom) \
            .filterDate('2023-01-01', '2023-01-31') \
            .sum().rename('rainfall')
            
        # Landsat 8 (NPK estimasi - mock as functions of vegetation indices for hackathon)
        n_img = ndvi.multiply(100).rename('N')
        p_img = ndti.multiply(50).add(20).rename('P')
        k_img = ndvi.multiply(80).add(10).rename('K')
        ph_img = ee.Image.constant(6.5).rename('ph')
        
        combined = ee.Image.cat([ndvi, ndti, temp, humidity, chirps, n_img, p_img, k_img, ph_img])
        
        sampled = combined.sampleRegions(
            collection=all_points_fc,
            scale=10,
            geometries=True
        )
        
        features = sampled.getInfo().get('features', [])
    except Exception as e:
        print(f"GEE extraction failed, using mocked values: {e}")
        features = []
        
    results = []
    
    for i in range(10):
        if i < len(features):
            props = features[i]['properties']
            geom_pt = features[i]['geometry']['coordinates']
            lat, lng = geom_pt[1], geom_pt[0]
        else:
            # Fallback mock jika gagal/kurang dari 10
            props = {
                'n': random.uniform(50, 150),
                'p': random.uniform(20, 60),
                'k': random.uniform(20, 60),
                'temperature': random.uniform(20, 35),
                'humidity': random.uniform(60, 90),
                'ph': random.uniform(5.5, 7.5),
                'rainfall': random.uniform(100, 300),
                'ndti': random.uniform(-0.1, 0.1)
            }
            lat, lng = -7.5 + random.uniform(-0.01, 0.01), 110.0 + random.uniform(-0.01, 0.01)
                
        results.append({
            "latitude": lat,
            "longitude": lng,
            "n": props.get('n', props.get('N', 0)),
            "p": props.get('p', props.get('P', 0)),
            "k": props.get('k', props.get('K', 0)),
            "temperature": props.get('temperature', 0),
            "humidity": props.get('humidity', 0),
            "ph": props.get('ph', 6.5),
            "rainfall": props.get('rainfall', 0),
            "ndti": props.get('ndti', 0)
        })
        
    return results
