import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon, // 对话气泡图标
  PencilSquareIcon, // 添加文件上传图标
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid' // 实心对话气泡图标
import Card from './card' // 注释掉的卡片组件
import TreeList from './TreeList' // 引入树形列表组件
import Button from '@/app/components/base/button' // 按钮组件
import type { ConversationItem } from '@/types/app' // 对话项类型定义

// 合并类名的辅助函数
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

// 最大对话数量
const MAX_CONVERSATION_LENTH = 20

// Sidebar 组件的属性类型
export type ISidebarProps = {
  copyRight: string // 版权信息
  currentId: string // 当前选中的对话 ID
  onCurrentIdChange: (id: string) => void // 切换当前对话的回调函数
  list: ConversationItem[] // 对话列表
  onFileUpload: () => void // 添加文件上传的回调函数
  treeNodes: TreeNode[] // 树形列表节点
}

// 树形列表节点类型
type TreeNode = {
  id: string
  name: string
  children?: TreeNode[]
}

// Sidebar 组件
const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  onFileUpload, // 接收文件上传的回调函数
  treeNodes, // 树形列表节点
}) => {
  const { t } = useTranslation() // 国际化翻译钩子

  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto bg-white pc:w-[244px] tablet:w-[192px] mobile:w-[240px] border-r border-gray-200 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen"
    >
      {/* 上半部分 - 树形列表 */}
      <div className="flex-1">
        <TreeList />
      </div>

      {/* 下半部分 - 原有内容 */}
      <div className="flex-1 mt-4">
        {/* 如果对话列表长度小于最大长度，显示新对话按钮 */}
        {list.length < MAX_CONVERSATION_LENTH && (
          <div className="flex flex-shrink-0 p-4 !pb-0">
            <Button
              onClick={() => { onCurrentIdChange('-1') }} // 点击按钮时切换到新对话
              className="group block w-full flex-shrink-0 !justify-start !h-9 text-primary-600 items-center text-sm"
            >
              <PencilSquareIcon className="mr-2 h-4 w-4" /> {t('app.chat.newChat')} {/* 新对话按钮图标和文本 */}
            </Button>
          </div>
        )}

        <nav className="mt-4 flex-1 space-y-1 bg-white p-4 !pt-0">
          {/* 渲染对话列表 */}
          {list.map((item) => {
            const isCurrent = item.id === currentId // 判断当前对话是否为选中状态
            const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon // 根据选中状态选择图标

            return (
              <div
                onClick={() => onCurrentIdChange(item.id)} // 点击对话项时切换到该对话
                key={item.id}
                className={classNames(
                  isCurrent
                    ? 'bg-primary-50 text-primary-600' // 选中状态的样式
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700', // 默认状态的样式
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer',
                )}
              >
                <ItemIcon
                  className={classNames(
                    isCurrent
                      ? 'text-primary-600' // 选中状态的图标颜色
                      : 'text-gray-400 group-hover:text-gray-500', // 默认状态的图标颜色
                    'mr-3 h-5 w-5 flex-shrink-0',
                  )}
                  aria-hidden="true"
                />
                {item.name} {/* 对话名称 */}
                {/* {isCurrent && ( // 如果是当前选中的对话，显示文件上传按钮
                  <Button
                    onClick={onFileUpload}
                    className="ml-auto text-primary-600 text-sm"
                  >
                    <PaperClipIcon className="h-4 w-4" /> { }
                  </Button>
                )} */}
              </div>
            )
          })}
        </nav>

        {/* 注释掉的链接到 LangGenius 的卡片组件 */}
        <a className="flex flex-shrink-0 p-4" href="https://langgenius.ai/" target="_blank">
          <Card>
            <div className="flex flex-row items-center">
              <ChatBubbleOvalLeftEllipsisSolidIcon className="text-primary-600 h-6 w-6 mr-2" />
              <span>DICP</span>
            </div>
          </Card>
        </a>
      </div>

      {/* 版权信息 */}
      <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        <div className="text-gray-400 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar) // 使用 React.memo 进行性能优化
