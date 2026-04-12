"""Claude API integration for guide generation"""

import os
from typing import List
import anthropic
from anthropic import Anthropic

from app.models import GenerateRequest, GenerateResponse, SearchResult


class ClaudeGenerator:
    """Generate troubleshooting guides using Claude API"""

    def __init__(self, api_key: str = None, model: str = None):
        """
        Initialize Claude generator

        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
            model: Claude model to use (defaults to CLAUDE_MODEL env var)
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable must be set")

        self.model = model or os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")
        self.client = Anthropic(api_key=self.api_key)

        print(f"Claude Generator initialized with model: {self.model}")

    def _build_prompt(self, request: GenerateRequest) -> str:
        """Build prompt for guide generation"""

        # Format search results
        context_docs = []
        for i, result in enumerate(request.search_results, 1):
            context_docs.append(
                f"[문서 {i}] {result.title}\n"
                f"출처: {result.source}\n"
                f"내용: {result.content}\n"
                f"관련도: {result.score:.3f}"
            )

        context = "\n\n".join(context_docs)

        prompt = f"""당신은 IT 기술 지원 전문가입니다. 사용자가 보고한 VOC(Voice of Customer)를 분석하고, 검색된 관련 문서들을 바탕으로 상세한 문제 해결 가이드를 작성해주세요.

## VOC 정보
제목: {request.voc_title}
상세 설명: {request.voc_description}

## 검색된 관련 문서
{context}

## 작성 지침
위 검색 결과를 참고하여 다음 형식으로 문제 해결 가이드를 작성해주세요:

1. **문제(Problem)**: VOC에서 보고된 문제를 명확하게 정의
2. **원인(Cause)**: 문제가 발생한 가능한 원인들을 분석
3. **절차(Procedure)**: 단계별 문제 해결 절차를 구체적으로 설명
4. **해결(Solution)**: 최종 해결 방법과 예방 조치를 요약
5. **출처(Sources)**: 참고한 문서의 출처를 명시

각 섹션은 명확하고 실행 가능한 내용으로 작성하되, 검색된 문서의 정보를 최대한 활용해주세요.
출처 섹션에는 실제로 참고한 문서의 출처만 나열해주세요.

응답 형식:
각 섹션을 다음과 같이 구분하여 작성해주세요:
- 문제: (내용)
- 원인: (내용)
- 절차: (내용)
- 해결: (내용)
- 출처: (내용)
"""

        return prompt

    def _parse_response(self, response_text: str) -> GenerateResponse:
        """Parse Claude's response into structured format"""

        # Initialize sections
        sections = {
            "problem": "",
            "cause": "",
            "procedure": "",
            "solution": "",
            "sources": ""
        }

        # Keywords to identify sections
        section_keywords = {
            "problem": ["문제:", "문제 :", "Problem:", "문제"],
            "cause": ["원인:", "원인 :", "Cause:", "원인"],
            "procedure": ["절차:", "절차 :", "Procedure:", "절차"],
            "solution": ["해결:", "해결 :", "Solution:", "해결"],
            "sources": ["출처:", "출처 :", "Sources:", "출처"]
        }

        lines = response_text.split('\n')
        current_section = None

        for line in lines:
            line = line.strip()

            # Check if line starts a new section
            section_found = False
            for section, keywords in section_keywords.items():
                for keyword in keywords:
                    if line.startswith(keyword):
                        current_section = section
                        # Extract content after the keyword
                        content = line[len(keyword):].strip()
                        if content:
                            sections[section] = content
                        section_found = True
                        break
                if section_found:
                    break

            # If not a section header, append to current section
            if not section_found and current_section and line:
                if sections[current_section]:
                    sections[current_section] += "\n" + line
                else:
                    sections[current_section] = line

        return GenerateResponse(
            problem=sections["problem"] or "문제 정보를 추출할 수 없습니다.",
            cause=sections["cause"] or "원인 정보를 추출할 수 없습니다.",
            procedure=sections["procedure"] or "절차 정보를 추출할 수 없습니다.",
            solution=sections["solution"] or "해결 정보를 추출할 수 없습니다.",
            sources=sections["sources"] or "출처 정보를 추출할 수 없습니다."
        )

    def generate_guide(self, request: GenerateRequest) -> GenerateResponse:
        """
        Generate troubleshooting guide using Claude API

        Args:
            request: GenerateRequest containing VOC info and search results

        Returns:
            GenerateResponse with structured guide
        """
        prompt = self._build_prompt(request)

        try:
            # Call Claude API
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                temperature=0.7,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract response text
            response_text = message.content[0].text

            # Parse into structured format
            result = self._parse_response(response_text)

            return result

        except anthropic.APIError as e:
            raise Exception(f"Claude API error: {str(e)}")
        except Exception as e:
            raise Exception(f"Error generating guide: {str(e)}")


# Global instance
_generator: ClaudeGenerator = None


def get_generator() -> ClaudeGenerator:
    """Get or create the global generator instance"""
    global _generator
    if _generator is None:
        _generator = ClaudeGenerator()
    return _generator
