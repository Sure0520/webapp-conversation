import React, { useEffect, useState } from 'react'
import { Tree, Upload } from 'antd'
import { DownOutlined, PaperClipOutlined } from '@ant-design/icons'
import axios from 'axios'

// 定义树节点的接口
type TreeNode = {
  id: string
  title: string
  children?: TreeNode[]
}

// 定义树列表组件的属性接口
type TreeListProps = {
  nodes?: TreeNode[]
  onNodeClick: (id: string) => void
  onCheck: (checkedKeys: string[]) => void
}

// 树列表组件
const TreeList: React.FC<TreeListProps> = ({ nodes = [], onNodeClick, onCheck }) => {
  // 处理树节点选择事件
  const onTreeSelect = (selectedKeys: string[], info: any) => {
    if (info.selected)
      onNodeClick(selectedKeys[0])
  }

  // 渲染树节点
  const renderTreeNodes = (data: TreeNode[]) =>
    data.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode key={item.id} title={renderNodeTitle(item)} selectable={false}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        )
      }
      return <Tree.TreeNode key={item.id} title={item.title} />
    })

  // 渲染节点标题，包括附件上传图标
  const renderNodeTitle = (node: TreeNode) => {
    if (node.id === '1') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{node.title}</span>
          <Upload
            accept=".pdf,.doc,.docx,image/*"
            style={{ marginLeft: 8 }}
            beforeUpload={(file) => {
              console.log('File selected:', file)
              return false // 阻止默认上传行为，你可以在这里处理文件上传逻辑
            }}
            onClick={e => e.stopPropagation()} // 阻止事件冒泡
          >
            <PaperClipOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
          </Upload>
        </div>
      )
    }
    return node.title
  }

  return (
    <Tree
      checkable
      showLine
      defaultExpandAll
      onSelect={onTreeSelect}
      onCheck={onCheck}
      switcherIcon={<DownOutlined />}
    >
      {renderTreeNodes(nodes)}
    </Tree>
  )
}

// 主应用组件
const App: React.FC = () => {
  // 管理树数据的状态
  const [treeData, setTreeData] = useState<TreeNode[]>([])

  // 处理节点点击事件
  const handleNodeClick = (id: string) => {
    console.log(`Node clicked: ${id}`)
  }

  // 处理节点选中事件
  const handleNodeCheck = (checkedKeys: string[]) => {
    console.log('Checked keys:', checkedKeys)
  }

  // 在组件挂载时获取树数据
  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        // 发送请求获取数据
        const response = await axios.get('http://10.159.196.28/v1/datasets', {
          params: {
            page: 1,
            limit: 20,
          },
          headers: {
            Authorization: 'Bearer dataset-2P9hDamIXGtCbsORKD2D6A24', // 确保 Authorization 头格式正确
          },
        })

        // 获取响应数据
        const { data } = response.data

        // 格式化数据，转换为树节点格式
        const formattedData: TreeNode[] = data.map((item: any) => ({
          id: item.id,
          title: item.name,
        }))

        // 输出格式化后的数据，便于调试
        console.log('Formatted Data:', formattedData)

        // 更新树数据状态
        setTreeData([
          {
            id: '1',
            title: '个人',
            children: formattedData, // 将格式化后的数据作为子节点
          },
          {
            id: '2',
            title: '制度',
          },
        ])
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // 调用数据获取函数
    fetchTreeData()
  }, [])

  return (
    <div>
      <h1>知识库</h1>
      <TreeList nodes={treeData} onNodeClick={handleNodeClick} onCheck={handleNodeCheck} />
    </div>
  )
}

export default React.memo(App) // 使用 React.memo 进行性能优化
