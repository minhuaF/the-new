import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            让英文阅读更简单
          </h1>

          <p className="text-xl md:text-2xl text-gray-600">
            智能标注 · 发音学习 · 高效记忆
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            在阅读中学习，通过标注掌握单词发音和用法，
            让每一篇文章都成为你的专属学习材料
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Button size="lg" asChild>
              <Link href="/signup">
                开始使用
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                登录
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">阅读标注</h3>
            <p className="text-gray-600">
              选中单词即可标注，高亮显示音标和释义
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🔊</div>
            <h3 className="text-xl font-semibold mb-2">发音学习</h3>
            <p className="text-gray-600">
              点击单词播放发音，掌握标准读音
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">智能管理</h3>
            <p className="text-gray-600">
              侧边栏统一管理所有标注，随时复习
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 text-center text-gray-600">
        <p>© 2025 英语学习平台. All rights reserved.</p>
      </footer>
    </div>
  );
}
