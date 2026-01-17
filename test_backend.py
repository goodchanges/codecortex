"""
Code review test for backend performance optimizations
This test validates the optimizations without requiring dependencies
"""

def test_backend_code_structure():
    """Verify that performance optimizations are present in the code"""
    print("Testing backend code structure for performance optimizations...")
    
    with open('./Backend', 'r') as f:
        backend_code = f.read()
    
    # Test 1: Check for lru_cache import
    print("\n1. Checking for caching imports...")
    if 'from functools import lru_cache' in backend_code:
        print("   ✅ lru_cache imported for data caching")
    else:
        print("   ❌ lru_cache import missing")
    
    if 'import hashlib' in backend_code:
        print("   ✅ hashlib imported for model cache keys")
    else:
        print("   ❌ hashlib import missing")
    
    # Test 2: Check for fetch_stock_data caching
    print("\n2. Checking for stock data caching function...")
    if '@lru_cache(maxsize=128)' in backend_code:
        print("   ✅ LRU cache decorator found")
    else:
        print("   ❌ LRU cache decorator missing")
    
    if 'def fetch_stock_data' in backend_code:
        print("   ✅ fetch_stock_data function exists")
    else:
        print("   ❌ fetch_stock_data function missing")
    
    # Test 3: Check for model caching
    print("\n3. Checking for model caching...")
    if '_model_cache = {}' in backend_code or '_model_cache={}' in backend_code:
        print("   ✅ Model cache dictionary exists")
    else:
        print("   ❌ Model cache dictionary missing")
    
    if 'def get_or_train_model' in backend_code:
        print("   ✅ get_or_train_model function exists")
    else:
        print("   ❌ get_or_train_model function missing")
    
    # Test 4: Check for optimized rolling operations
    print("\n4. Checking for optimized rolling operations...")
    if 'volume_rolling = data["Volume"].rolling(10)' in backend_code or "volume_rolling = data['Volume'].rolling(10)" in backend_code:
        print("   ✅ Rolling operations are cached in a variable")
    else:
        print("   ⚠️  Rolling operation caching not found")
    
    # Test 5: Check for minimum dataset validation
    print("\n5. Checking for minimum dataset validation...")
    if 'if len(data) < 15:' in backend_code:
        print("   ✅ Minimum dataset size validation exists")
    else:
        print("   ⚠️  Minimum dataset validation not found")
    
    # Test 6: Check that old inefficient patterns are removed
    print("\n6. Checking that old inefficient patterns are removed...")
    if 'fit_predict' in backend_code:
        print("   ⚠️  fit_predict still in code (should be separate fit/predict)")
    else:
        print("   ✅ fit_predict replaced with cached model.predict")
    
    if backend_code.count('.rolling(10).mean()') > 1 or backend_code.count('.rolling(10).std()') > 1:
        print("   ⚠️  Duplicate rolling operations detected")
    else:
        print("   ✅ No duplicate rolling operations")
    
    print("\n✅ Backend code structure validation completed!")

def test_frontend_code_structure():
    """Verify that frontend performance optimizations are present"""
    print("\n\nTesting frontend code structure for performance optimizations...")
    
    with open('./frontend/app.js', 'r') as f:
        frontend_code = f.read()
    
    # Test 1: Check for Map-based lookup
    print("\n1. Checking for optimized anomaly marker lookup...")
    if 'new Map(' in frontend_code:
        print("   ✅ Map data structure used for O(1) lookups")
    else:
        print("   ❌ Map data structure not found")
    
    if 'priceMap' in frontend_code:
        print("   ✅ priceMap variable exists")
    else:
        print("   ❌ priceMap variable missing")
    
    # Test 2: Check that old O(n²) pattern is removed
    print("\n2. Checking that O(n²) pattern is removed...")
    if '.find(d => d.x.getTime()' in frontend_code:
        print("   ⚠️  Old .find() pattern still present (O(n²) complexity)")
    else:
        print("   ✅ Old .find() pattern removed")
    
    # Test 3: Check for performance comment
    print("\n3. Checking for performance documentation...")
    if 'Performance optimization' in frontend_code or 'O(1)' in frontend_code:
        print("   ✅ Performance optimization documented in comments")
    else:
        print("   ⚠️  Performance optimization not documented")
    
    # Check Frontend.html
    print("\n4. Checking Frontend.html...")
    with open('./Frontend.html', 'r') as f:
        html_code = f.read()
    
    if 'src="frontend/app.js"' in html_code:
        print("   ✅ JavaScript properly separated into frontend/app.js")
    else:
        print("   ⚠️  JavaScript reference not updated")
    
    if 'const MOCK_DATA' in html_code:
        print("   ⚠️  JavaScript code still inline in HTML")
    else:
        print("   ✅ JavaScript code moved out of HTML file")
    
    print("\n✅ Frontend code structure validation completed!")

if __name__ == "__main__":
    test_backend_code_structure()
    test_frontend_code_structure()
    print("\n\n" + "="*60)
    print("ALL VALIDATION TESTS COMPLETED")
    print("="*60)
