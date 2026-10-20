import { Component, type ReactNode } from 'react';

/** Renderer or lazy-module failures must stay inside the preview. */
export class ReaderBoundary extends Component<{ children: ReactNode; onError: (message: string) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {
    this.props.onError('Reader gagal dimuat. Coba lagi; jika aplikasi baru diperbarui, muat ulang halaman.');
  }
  render() { return this.state.failed ? null : this.props.children; }
}
