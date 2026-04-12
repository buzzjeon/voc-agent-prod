"""Mock sample documents for testing"""

SAMPLE_DOCUMENTS = [
    {
        "doc_id": "doc_001",
        "title": "Windows 10 부팅 오류 해결",
        "content": "Windows 10에서 부팅 오류가 발생하는 경우, 먼저 안전 모드로 진입하여 시스템 파일 검사를 실행합니다. sfc /scannow 명령을 관리자 권한 명령 프롬프트에서 실행하세요.",
        "source": "Microsoft KB12345"
    },
    {
        "doc_id": "doc_002",
        "title": "네트워크 연결 끊김 문제",
        "content": "무선 네트워크 연결이 자주 끊기는 경우, 네트워크 어댑터 드라이버를 최신 버전으로 업데이트하고 전원 관리 설정에서 '컴퓨터가 이 장치를 끄게 하여 전원 절약' 옵션을 해제하세요.",
        "source": "Network Troubleshooting Guide v2.1"
    },
    {
        "doc_id": "doc_003",
        "title": "프린터 오프라인 상태 해결",
        "content": "프린터가 오프라인 상태로 표시되는 경우, 프린터 대기열을 초기화하고 프린터 스풀러 서비스를 재시작합니다. services.msc에서 Print Spooler 서비스를 찾아 재시작하세요.",
        "source": "Printer Support Manual"
    },
    {
        "doc_id": "doc_004",
        "title": "Outlook 이메일 동기화 오류",
        "content": "Outlook에서 이메일이 동기화되지 않는 경우, OST 파일 손상 여부를 확인하고 필요시 새 프로필을 만듭니다. 제어판 > 메일 > 프로필 표시에서 새 프로필을 추가할 수 있습니다.",
        "source": "Office 365 Admin Guide"
    },
    {
        "doc_id": "doc_005",
        "title": "Chrome 브라우저 느린 속도 개선",
        "content": "Chrome이 느리게 실행되는 경우, 불필요한 확장 프로그램을 제거하고 브라우저 캐시를 정리합니다. 설정 > 개인정보 및 보안 > 인터넷 사용 기록 삭제에서 캐시를 지울 수 있습니다.",
        "source": "Browser Optimization Guide"
    },
    {
        "doc_id": "doc_006",
        "title": "USB 장치 인식 안됨",
        "content": "USB 장치가 인식되지 않는 경우, 장치 관리자에서 알 수 없는 장치를 제거하고 컴퓨터를 재부팅합니다. 다른 USB 포트를 사용해보거나 USB 허브 없이 직접 연결하세요.",
        "source": "Hardware Troubleshooting KB"
    },
    {
        "doc_id": "doc_007",
        "title": "Excel 파일 열림 오류",
        "content": "Excel 파일이 열리지 않는 경우, 파일이 손상되었거나 호환되지 않는 형식일 수 있습니다. '열기 및 복구' 기능을 사용하거나 이전 버전의 Excel로 열어보세요.",
        "source": "Office Application Support"
    },
    {
        "doc_id": "doc_008",
        "title": "VPN 연결 실패 문제",
        "content": "VPN 연결이 실패하는 경우, 방화벽 설정을 확인하고 VPN 프로토콜이 차단되지 않았는지 검토합니다. 회사 IT 부서에 필요한 포트 정보를 문의하세요.",
        "source": "Corporate IT Security Policy"
    },
    {
        "doc_id": "doc_009",
        "title": "Zoom 화면 공유 오류",
        "content": "Zoom에서 화면 공유가 안 되는 경우, 시스템 환경설정 > 보안 및 개인정보 보호 > 화면 기록에서 Zoom에 권한을 부여해야 합니다.",
        "source": "Zoom Support Documentation"
    },
    {
        "doc_id": "doc_010",
        "title": "Windows Update 설치 실패",
        "content": "Windows Update가 설치되지 않는 경우, Windows Update 문제 해결사를 실행하고 SoftwareDistribution 폴더의 내용을 삭제한 후 다시 시도합니다.",
        "source": "Windows Update Troubleshooting"
    },
    {
        "doc_id": "doc_011",
        "title": "Teams 오디오 문제",
        "content": "Microsoft Teams에서 오디오가 작동하지 않는 경우, 장치 설정에서 올바른 마이크와 스피커가 선택되었는지 확인하고 Teams에 마이크 권한이 부여되었는지 확인합니다.",
        "source": "Teams User Manual"
    },
    {
        "doc_id": "doc_012",
        "title": "블루스크린 오류 분석",
        "content": "블루스크린(BSOD)이 발생하는 경우, 오류 코드를 기록하고 최근 설치한 드라이버나 소프트웨어를 제거합니다. 메모리 진단 도구를 실행하여 하드웨어 문제를 확인하세요.",
        "source": "Advanced Windows Diagnostics"
    },
    {
        "doc_id": "doc_013",
        "title": "PDF 파일 인쇄 문제",
        "content": "PDF 파일이 인쇄되지 않는 경우, '이미지로 인쇄' 옵션을 활성화하거나 Adobe Reader를 최신 버전으로 업데이트합니다. 프린터 드라이버도 함께 업데이트하세요.",
        "source": "Document Printing Guide"
    },
    {
        "doc_id": "doc_014",
        "title": "이메일 첨부파일 열기 오류",
        "content": "이메일 첨부파일이 열리지 않는 경우, 파일 확장자가 차단되었거나 보안 정책에 의해 제한될 수 있습니다. 파일을 다운로드한 후 속성에서 차단 해제를 시도하세요.",
        "source": "Email Security Best Practices"
    },
    {
        "doc_id": "doc_015",
        "title": "WiFi 연결은 되지만 인터넷 안됨",
        "content": "WiFi에 연결되지만 인터넷이 안 되는 경우, DNS 설정을 Google DNS(8.8.8.8, 8.8.4.4)로 변경하고 네트워크 어댑터를 재설정합니다. ipconfig /flushdns 명령을 실행하세요.",
        "source": "Network Configuration Manual"
    },
    {
        "doc_id": "doc_016",
        "title": "하드디스크 용량 부족 해결",
        "content": "디스크 공간이 부족한 경우, 디스크 정리 도구를 실행하고 임시 파일, 다운로드 폴더, 휴지통을 비웁니다. 저장소 센스를 활성화하여 자동으로 공간을 확보하세요.",
        "source": "Storage Management Guide"
    },
    {
        "doc_id": "doc_017",
        "title": "Mac에서 앱이 열리지 않음",
        "content": "Mac에서 앱이 열리지 않는 경우, 시스템 환경설정 > 보안 및 개인정보 보호에서 '확인 없이 열기'를 클릭합니다. Gatekeeper가 알 수 없는 개발자의 앱을 차단할 수 있습니다.",
        "source": "macOS Security Manual"
    },
    {
        "doc_id": "doc_018",
        "title": "배터리 빨리 닳는 문제",
        "content": "노트북 배터리가 빨리 소모되는 경우, 백그라운드에서 실행되는 앱을 종료하고 화면 밝기를 낮춥니다. 전원 설정을 '절전 모드'로 변경하고 배터리 상태를 점검하세요.",
        "source": "Mobile Device Power Management"
    },
    {
        "doc_id": "doc_019",
        "title": "키보드 입력 안됨",
        "content": "키보드가 작동하지 않는 경우, USB 연결을 확인하고 다른 포트에 연결해봅니다. 무선 키보드의 경우 배터리를 교체하고 Bluetooth 연결을 재설정하세요.",
        "source": "Peripheral Device Support"
    },
    {
        "doc_id": "doc_020",
        "title": "화면 해상도 설정 오류",
        "content": "화면 해상도가 이상하게 표시되는 경우, 그래픽 드라이버를 업데이트하고 권장 해상도로 설정합니다. 설정 > 시스템 > 디스플레이에서 해상도를 변경할 수 있습니다.",
        "source": "Display Configuration Guide"
    },
    {
        "doc_id": "doc_021",
        "title": "소프트웨어 설치 오류",
        "content": "소프트웨어 설치가 실패하는 경우, 관리자 권한으로 설치 프로그램을 실행하고 충분한 디스크 공간이 있는지 확인합니다. 바이러스 백신 프로그램을 일시적으로 비활성화해보세요.",
        "source": "Software Deployment Manual"
    },
    {
        "doc_id": "doc_022",
        "title": "웹캠 작동 안함",
        "content": "웹캠이 작동하지 않는 경우, 장치 관리자에서 카메라 드라이버를 업데이트하고 앱에 카메라 권한이 부여되었는지 확인합니다. 물리적 프라이버시 셔터가 닫혀있지 않은지 확인하세요.",
        "source": "Camera Troubleshooting Guide"
    },
    {
        "doc_id": "doc_023",
        "title": "파일 삭제 안됨",
        "content": "파일이 삭제되지 않는 경우, 파일을 사용 중인 프로그램이 있는지 확인하고 작업 관리자에서 해당 프로세스를 종료합니다. 안전 모드에서 삭제를 시도해보세요.",
        "source": "File System Management"
    },
    {
        "doc_id": "doc_024",
        "title": "Bluetooth 기기 연결 실패",
        "content": "Bluetooth 기기가 연결되지 않는 경우, 기기를 페어링 모드로 전환하고 다른 기기와의 연결을 끊습니다. Bluetooth 서비스를 재시작하고 기기 드라이버를 업데이트하세요.",
        "source": "Wireless Connectivity Manual"
    },
    {
        "doc_id": "doc_025",
        "title": "스피커 소리 안나옴",
        "content": "스피커에서 소리가 나지 않는 경우, 볼륨이 음소거되지 않았는지 확인하고 올바른 재생 장치가 선택되었는지 확인합니다. 오디오 드라이버를 재설치해보세요.",
        "source": "Audio Device Support"
    },
    {
        "doc_id": "doc_026",
        "title": "게임 실행 오류",
        "content": "게임이 실행되지 않는 경우, DirectX와 Visual C++ 재배포 패키지를 최신 버전으로 업데이트합니다. 그래픽 드라이버도 최신 버전으로 업데이트하고 관리자 권한으로 실행하세요.",
        "source": "Gaming Support Documentation"
    },
    {
        "doc_id": "doc_027",
        "title": "마우스 커서 움직임 이상",
        "content": "마우스 커서가 불규칙하게 움직이는 경우, 마우스 센서 렌즈를 청소하고 마우스 패드를 교체합니다. 무선 마우스의 경우 배터리를 교체하고 USB 수신기를 다른 포트에 연결하세요.",
        "source": "Input Device Troubleshooting"
    },
    {
        "doc_id": "doc_028",
        "title": "클라우드 동기화 오류",
        "content": "OneDrive나 Google Drive 동기화가 안 되는 경우, 인터넷 연결을 확인하고 계정 연결 상태를 점검합니다. 동기화 클라이언트를 재시작하고 필요시 계정을 다시 연결하세요.",
        "source": "Cloud Storage Admin Guide"
    },
    {
        "doc_id": "doc_029",
        "title": "화면 깜빡임 문제",
        "content": "화면이 깜빡이는 경우, 모니터 케이블 연결을 확인하고 주사율 설정을 조정합니다. 그래픽 드라이버를 업데이트하거나 이전 버전으로 롤백해보세요.",
        "source": "Display Troubleshooting Manual"
    },
    {
        "doc_id": "doc_030",
        "title": "비밀번호 재설정",
        "content": "Windows 비밀번호를 잊은 경우, Microsoft 계정 복구 페이지에서 비밀번호를 재설정할 수 있습니다. 로컬 계정의 경우 비밀번호 재설정 디스크나 관리자 계정을 사용하세요.",
        "source": "Account Security Guide"
    },
    {
        "doc_id": "doc_031",
        "title": "앱 충돌 및 응답 없음",
        "content": "앱이 자주 충돌하거나 응답하지 않는 경우, 앱을 재설치하고 Windows를 최신 버전으로 업데이트합니다. 이벤트 뷰어에서 오류 로그를 확인하여 원인을 파악하세요.",
        "source": "Application Stability Guide"
    },
    {
        "doc_id": "doc_032",
        "title": "파일 공유 접근 거부",
        "content": "네트워크 파일 공유에 접근할 수 없는 경우, 공유 권한과 NTFS 권한을 확인합니다. 네트워크 자격 증명을 다시 입력하고 네트워크 검색이 활성화되어 있는지 확인하세요.",
        "source": "Network File Sharing Manual"
    },
    {
        "doc_id": "doc_033",
        "title": "시스템 속도 느림",
        "content": "컴퓨터가 느리게 작동하는 경우, 시작 프로그램을 정리하고 백그라운드 프로세스를 종료합니다. 디스크 조각 모음을 실행하고 RAM 업그레이드를 고려하세요.",
        "source": "System Performance Optimization"
    },
    {
        "doc_id": "doc_034",
        "title": "외장 하드 인식 불가",
        "content": "외장 하드드라이브가 인식되지 않는 경우, 디스크 관리에서 드라이브 문자를 할당하고 파일 시스템을 확인합니다. 다른 컴퓨터에 연결하여 하드웨어 문제인지 확인하세요.",
        "source": "External Storage Support"
    },
    {
        "doc_id": "doc_035",
        "title": "메모리 부족 오류",
        "content": "메모리 부족 오류가 발생하는 경우, 불필요한 프로그램을 종료하고 가상 메모리 설정을 늘립니다. 작업 관리자에서 메모리 사용량이 높은 프로세스를 확인하세요.",
        "source": "Memory Management Guide"
    },
    {
        "doc_id": "doc_036",
        "title": "원격 데스크톱 연결 실패",
        "content": "원격 데스크톱 연결이 안 되는 경우, 원격 컴퓨터에서 원격 데스크톱이 활성화되어 있는지 확인하고 방화벽에서 3389 포트가 열려있는지 확인합니다.",
        "source": "Remote Access Configuration"
    },
    {
        "doc_id": "doc_037",
        "title": "자동 업데이트 비활성화",
        "content": "Windows 자동 업데이트를 비활성화하려면, 서비스에서 Windows Update 서비스를 중지하고 그룹 정책 편집기에서 자동 업데이트 구성을 비활성화합니다.",
        "source": "Update Management Policy"
    },
    {
        "doc_id": "doc_038",
        "title": "바이러스 감염 의심",
        "content": "바이러스 감염이 의심되는 경우, 안전 모드로 부팅하여 전체 시스템 검사를 실행합니다. Windows Defender나 타사 백신 프로그램으로 전체 스캔을 수행하세요.",
        "source": "Security Threat Response"
    },
    {
        "doc_id": "doc_039",
        "title": "듀얼 모니터 설정",
        "content": "듀얼 모니터를 설정하려면, 두 번째 모니터를 연결하고 디스플레이 설정에서 '화면 확장'을 선택합니다. 각 모니터의 해상도와 위치를 조정할 수 있습니다.",
        "source": "Multi-Display Configuration"
    },
    {
        "doc_id": "doc_040",
        "title": "휴지통 복구",
        "content": "실수로 삭제한 파일을 복구하려면, 휴지통을 열어 파일을 찾아 복원합니다. 휴지통을 비운 경우 파일 복구 소프트웨어를 사용하거나 백업에서 복원하세요.",
        "source": "Data Recovery Procedures"
    },
    {
        "doc_id": "doc_041",
        "title": "시간 동기화 오류",
        "content": "시스템 시간이 맞지 않는 경우, 날짜 및 시간 설정에서 '자동으로 시간 설정'을 활성화하고 시간 서버와 동기화합니다. CMOS 배터리 교체가 필요할 수 있습니다.",
        "source": "Time Synchronization Guide"
    },
    {
        "doc_id": "doc_042",
        "title": "프로그램 제거 안됨",
        "content": "프로그램이 제거되지 않는 경우, 제어판의 프로그램 제거에서 제거를 시도하거나 제조사의 제거 도구를 사용합니다. 레지스트리 정리 도구로 잔여 항목을 삭제하세요.",
        "source": "Software Removal Guide"
    },
    {
        "doc_id": "doc_043",
        "title": "화면 보호기 설정",
        "content": "화면 보호기를 설정하려면, 개인 설정 > 잠금 화면 > 화면 보호기 설정에서 원하는 보호기를 선택하고 대기 시간을 설정합니다.",
        "source": "Desktop Customization Manual"
    },
    {
        "doc_id": "doc_044",
        "title": "파일 확장자 표시",
        "content": "파일 확장자를 표시하려면, 파일 탐색기 옵션에서 '보기' 탭으로 이동하여 '알려진 파일 형식의 파일 확장명 숨기기' 옵션을 해제합니다.",
        "source": "File Explorer Configuration"
    },
    {
        "doc_id": "doc_045",
        "title": "방화벽 설정 변경",
        "content": "Windows 방화벽 설정을 변경하려면, Windows Defender 방화벽에서 앱이나 기능을 허용할 수 있습니다. 특정 포트를 열거나 인바운드/아웃바운드 규칙을 추가하세요.",
        "source": "Firewall Configuration Guide"
    },
    {
        "doc_id": "doc_046",
        "title": "가상 메모리 최적화",
        "content": "가상 메모리를 최적화하려면, 시스템 속성 > 고급 > 성능 설정에서 가상 메모리를 물리적 RAM의 1.5배로 설정합니다. 페이징 파일을 다른 드라이브로 이동할 수 있습니다.",
        "source": "System Performance Tuning"
    },
    {
        "doc_id": "doc_047",
        "title": "작업 스케줄러 사용",
        "content": "작업 스케줄러를 사용하여 자동화된 작업을 만들 수 있습니다. 작업 스케줄러 라이브러리에서 새 작업을 만들고 트리거, 동작, 조건을 설정하세요.",
        "source": "Task Automation Guide"
    },
    {
        "doc_id": "doc_048",
        "title": "시스템 복원 지점 생성",
        "content": "시스템 복원 지점을 만들려면, 시스템 속성 > 시스템 보호에서 '만들기' 버튼을 클릭합니다. 중요한 변경 전에 복원 지점을 생성하는 것이 좋습니다.",
        "source": "System Backup Procedures"
    },
    {
        "doc_id": "doc_049",
        "title": "디스크 오류 검사",
        "content": "디스크 오류를 검사하려면, 파일 탐색기에서 드라이브를 마우스 오른쪽 버튼으로 클릭하고 속성 > 도구 > 오류 검사를 실행합니다. chkdsk 명령을 사용할 수도 있습니다.",
        "source": "Disk Maintenance Guide"
    },
    {
        "doc_id": "doc_050",
        "title": "네트워크 드라이브 연결",
        "content": "네트워크 드라이브를 연결하려면, 파일 탐색기에서 '네트워크 드라이브 연결'을 선택하고 공유 폴더의 경로를 입력합니다. 로그온 시 다시 연결 옵션을 활성화할 수 있습니다.",
        "source": "Network Storage Configuration"
    }
]


def get_sample_documents():
    """Return sample documents for testing"""
    return SAMPLE_DOCUMENTS
