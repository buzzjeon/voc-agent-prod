"""Simple test script for VOC Agent API"""

import requests
import json
from typing import Dict, Any


BASE_URL = "http://localhost:8000"


def print_section(title: str):
    """Print a formatted section title"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60 + "\n")


def print_json(data: Any):
    """Pretty print JSON data"""
    print(json.dumps(data, ensure_ascii=False, indent=2))


def test_health_check():
    """Test health check endpoint"""
    print_section("1. Health Check")

    response = requests.get(f"{BASE_URL}/health")

    if response.status_code == 200:
        print("Status: OK")
        print_json(response.json())
        return True
    else:
        print(f"Status: FAILED ({response.status_code})")
        print(response.text)
        return False


def test_search():
    """Test search endpoint"""
    print_section("2. Document Search")

    query = "Windows 부팅이 안됩니다"
    print(f"Query: {query}")
    print(f"Top-K: 5\n")

    response = requests.post(
        f"{BASE_URL}/search",
        json={
            "query": query,
            "top_k": 5
        }
    )

    if response.status_code == 200:
        results = response.json()
        print(f"Found {len(results)} results:\n")

        for i, result in enumerate(results, 1):
            print(f"[{i}] {result['title']}")
            print(f"    Score: {result['score']:.4f}")
            print(f"    Source: {result['source']}")
            print(f"    Content: {result['content'][:100]}...")
            print()

        return results
    else:
        print(f"Status: FAILED ({response.status_code})")
        print(response.text)
        return None


def test_generate(search_results):
    """Test generate endpoint"""
    print_section("3. Guide Generation")

    if not search_results:
        print("Skipping generation test (no search results)")
        return False

    voc_title = "Windows 부팅 실패"
    voc_description = "컴퓨터를 켜면 검은 화면만 나오고 Windows가 부팅되지 않습니다. 전원은 들어오는데 로고 화면 이후 멈춥니다."

    print(f"VOC Title: {voc_title}")
    print(f"VOC Description: {voc_description}")
    print(f"Using {len(search_results)} search results\n")

    response = requests.post(
        f"{BASE_URL}/generate",
        json={
            "voc_title": voc_title,
            "voc_description": voc_description,
            "search_results": search_results
        }
    )

    if response.status_code == 200:
        guide = response.json()
        print("Generated Guide:\n")

        print("문제(Problem):")
        print(guide['problem'])
        print("\n원인(Cause):")
        print(guide['cause'])
        print("\n절차(Procedure):")
        print(guide['procedure'])
        print("\n해결(Solution):")
        print(guide['solution'])
        print("\n출처(Sources):")
        print(guide['sources'])

        return True
    else:
        print(f"Status: FAILED ({response.status_code})")
        print(response.text)
        return False


def test_search_and_generate():
    """Test combined endpoint"""
    print_section("4. Combined Search and Generate")

    voc_title = "프린터 오프라인 문제"
    voc_description = "네트워크 프린터가 계속 오프라인으로 표시되어 인쇄를 할 수 없습니다"

    print(f"VOC Title: {voc_title}")
    print(f"VOC Description: {voc_description}\n")

    response = requests.post(
        f"{BASE_URL}/search-and-generate",
        params={
            "voc_title": voc_title,
            "voc_description": voc_description,
            "top_k": 10
        }
    )

    if response.status_code == 200:
        guide = response.json()
        print("Generated Guide (summary):\n")
        print(f"Problem: {guide['problem'][:100]}...")
        print(f"Solution: {guide['solution'][:100]}...")
        return True
    else:
        print(f"Status: FAILED ({response.status_code})")
        print(response.text)
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  VOC Agent API Test Suite")
    print("="*60)

    results = {}

    # Test 1: Health Check
    results['health'] = test_health_check()

    # Test 2: Search
    search_results = test_search()
    results['search'] = search_results is not None

    # Test 3: Generate (only if search succeeded)
    if search_results:
        results['generate'] = test_generate(search_results)
    else:
        results['generate'] = False

    # Test 4: Combined endpoint
    results['combined'] = test_search_and_generate()

    # Summary
    print_section("Test Summary")

    for test_name, passed in results.items():
        status = "PASSED" if passed else "FAILED"
        print(f"{test_name:20s}: {status}")

    all_passed = all(results.values())
    print(f"\nOverall: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")

    return all_passed


if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except requests.exceptions.ConnectionError:
        print("\nERROR: Cannot connect to server at", BASE_URL)
        print("Make sure the server is running:")
        print("  uvicorn app.main:app --reload")
        exit(1)
    except Exception as e:
        print(f"\nERROR: {str(e)}")
        exit(1)
