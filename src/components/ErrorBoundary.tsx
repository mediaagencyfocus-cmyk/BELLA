import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'حدث خطأ غير متوقع في واجهة المتجر',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BELLA SHOES ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#08090C] text-slate-900 dark:text-white p-6 text-right" dir="rtl">
          <div className="max-w-md w-full rounded-3xl bg-slate-50 dark:bg-[#111319] border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-lg font-black font-brand">عذراً، حدث خلل تقني مؤقت</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              واجه المتجر خطأً غير متوقع أثناء معالجة البيانات. يمكنك إعادة تحميل الصفحة لاستعادة العمل بشكل طبيعي.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full h-11 rounded-xl bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة تحميل المتجر</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
