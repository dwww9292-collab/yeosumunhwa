import { useId } from "react";
import { Link } from "react-router-dom";
import type { ConsentSpec } from "./consent";

interface Props {
  spec: ConsentSpec;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 약관처럼 고지표가 없는 동의는 본문 대신 링크만 노출 */
  policyPath?: string;
}

/**
 * 개인정보 수집·이용 동의 블록.
 * 목적·항목·보유기간을 표로 고지하고 체크박스로 동의를 받는다.
 */
export default function ConsentBox({ spec, checked, onChange, policyPath }: Props) {
  const id = useId();
  const descId = `${id}-desc`;

  return (
    <fieldset className="border border-gray-300 rounded-lg p-4">
      <legend className="px-1 text-sm font-medium text-gray-800">
        {spec.title}
        <span className="ml-1 text-[#c0392b]">{spec.required ? "(필수)" : "(선택)"}</span>
      </legend>

      {policyPath ? (
        <p className="text-sm text-gray-600" id={descId}>
          <Link to={policyPath} target="_blank" className="text-[#1a4fa0] underline">
            {spec.title.replace(" 동의", "")} 전문 보기
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto" id={descId}>
          <table className="w-full text-sm border-t border-gray-200">
            <caption className="sr-only">{spec.title} 고지 내용</caption>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <th scope="row" className="text-left font-medium text-gray-500 py-2 pr-4 w-24 align-top">
                  수집 목적
                </th>
                <td className="py-2 text-gray-700">{spec.purpose}</td>
              </tr>
              <tr>
                <th scope="row" className="text-left font-medium text-gray-500 py-2 pr-4 align-top">
                  수집 항목
                </th>
                <td className="py-2 text-gray-700">{spec.items}</td>
              </tr>
              <tr>
                <th scope="row" className="text-left font-medium text-gray-500 py-2 pr-4 align-top">
                  보유 기간
                </th>
                <td className="py-2 text-gray-700">{spec.retention}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">{spec.refusal}</p>

      <label className="mt-3 flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={descId}
          className="w-4 h-4"
        />
        위 내용을 확인하였으며 이에 동의합니다.
      </label>
    </fieldset>
  );
}
