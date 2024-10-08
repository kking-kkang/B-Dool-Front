import { useState } from "react";
import { MemberModel } from "@/app/models/member.model";
import { authService } from "@/app/services/auth/auth.api";
import VerificationCodeForm from "./VerificationCodeForm";
import { BiMailSend } from "react-icons/bi";

export default function EmailLoginForm() {
  const [email, setEmail] = useState<string>('');
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await authService.login({email});
      if (response.member) {
        console.log('Login successful:', response.member);
        // 전달받은 member object 를 zustand 로 store 에 저장
        localStorage.setItem('jwtToken', response.token);
        // 동일한 member Id 속성을 가진 워크스페이스 리스트 컴포넌트 출력
      } else {
        setShowVerification(true);
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (member: MemberModel) => {
    console.log('Verification successful:', member);
    localStorage.setItem('jwtToken', (member as any).token);
    // 동일한 member Id 속성을 가진 워크스페이스 리스트 컴포넌트 출력
  };

  return (
    <div className="bg-base-300 rounded-btn p-4 lg:w-[640px]">      
      <h2 className="text-lg font-bold text-center">이메일로 시작하기</h2>
      <div className="mt-2 divider"></div>
      {error && <div className="mb-4 alert alert-error">{error}</div>}
      <form className="text-center">
        <label className="flex items-center gap-2 mb-4 input input-bordered">
          <BiMailSend className="w-6 h-6 opacity-70"/>
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="이메일" 
            required
          />
        </label>

        {showVerification ? (
            <VerificationCodeForm email={email} onSuccess={handleVerificationSuccess} />
        ) : (
          <button className="btn" type="submit" disabled={loading}>
            {loading ? '처리 중...' : '로그인'}
          </button>
        )}

      </form>
    </div>
  );
}
