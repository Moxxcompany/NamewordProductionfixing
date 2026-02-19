import requests
import sys
import json
from datetime import datetime

class NamewordAPITester:
    def __init__(self, base_url="https://fab79e0f-a27e-4cf1-8a5e-8c56c15588cf.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, status_code, response_data, error=None):
        """Log test result"""
        result = {
            "test_name": name,
            "success": success,
            "status_code": status_code,
            "response_data": response_data,
            "error": str(error) if error else None
        }
        self.test_results.append(result)

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/v1{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"📍 URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            try:
                response_json = response.json()
            except:
                response_json = {"raw_response": response.text}

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if 'message' in response_json:
                    print(f"📄 Message: {response_json['message']}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"📄 Response: {response_json}")

            self.log_test(name, success, response.status_code, response_json)
            return success, response_json

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.log_test(name, False, None, {}, e)
            return False, {}

    def test_register(self, test_data):
        """Test user registration"""
        return self.run_test(
            "User Registration",
            "POST",
            "/auth/register",
            201,  # Expecting 201 for successful registration
            data=test_data
        )

    def test_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"🔑 Token saved for authenticated requests")
        elif success and 'token' in response:
            self.token = response['token']
            print(f"🔑 Token saved for authenticated requests")
        return success, response

    def test_current_user(self):
        """Test getting current user info"""
        return self.run_test(
            "Current User Info",
            "GET",
            "/auth/me",
            200
        )

    def test_domain_search(self, domain):
        """Test domain search functionality"""
        return self.run_test(
            "Domain Search",
            "POST",
            "/domain/search",
            200,
            data={"domain": domain}
        )

    def test_logout(self):
        """Test user logout"""
        return self.run_test(
            "User Logout",
            "POST",
            "/auth/logout",
            200
        )

def main():
    print("🚀 Starting Nameword API Testing")
    print("=" * 50)
    
    # Initialize tester
    tester = NamewordAPITester()
    timestamp = datetime.now().strftime('%H%M%S')
    
    # Test data for registration
    test_user_data = {
        "name": "Test Browser User",
        "username": f"testbrowser{timestamp}",
        "email": f"testbrowser{timestamp}@example.com",
        "mobile": "11234567890",
        "password": "Test@1234",
        "passwordConfirmation": "Test@1234"
    }

    print(f"🧪 Test user: {test_user_data['email']}")

    # Test 1: User Registration
    print("\n" + "="*30)
    print("TEST 1: USER REGISTRATION")
    print("="*30)
    
    reg_success, reg_response = tester.test_register(test_user_data)
    
    if not reg_success:
        print("\n❌ Registration failed - cannot proceed with login test")
        # Still continue with other tests that don't require registration
    
    # Test 2: User Login (with the registered user)
    print("\n" + "="*30)
    print("TEST 2: USER LOGIN")
    print("="*30)
    
    login_success, login_response = tester.test_login(
        test_user_data['email'], 
        test_user_data['password']
    )
    
    if not login_success:
        print("\n⚠️  Login failed - will test with different credentials if needed")

    # Test 3: Current User Info (requires authentication)
    if tester.token:
        print("\n" + "="*30)
        print("TEST 3: CURRENT USER INFO")
        print("="*30)
        tester.test_current_user()

    # Test 4: Domain Search
    print("\n" + "="*30)
    print("TEST 4: DOMAIN SEARCH")
    print("="*30)
    tester.test_domain_search("example")

    # Test 5: Logout (if logged in)
    if tester.token:
        print("\n" + "="*30)
        print("TEST 5: USER LOGOUT")
        print("="*30)
        tester.test_logout()

    # Print final results
    print("\n" + "="*50)
    print("📊 FINAL TEST RESULTS")
    print("="*50)
    print(f"Total Tests: {tester.tests_run}")
    print(f"Passed: {tester.tests_passed}")
    print(f"Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")

    # Detailed results
    print("\n📋 Detailed Results:")
    for i, result in enumerate(tester.test_results, 1):
        status = "✅" if result['success'] else "❌"
        print(f"{i}. {status} {result['test_name']} - Status: {result['status_code']}")
        if result['error']:
            print(f"   Error: {result['error']}")

    # Save results to file
    with open('/app/backend_api_test_results.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2)

    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())