import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type {
  MessageTemplate,
  TemplateCategory,
  MessageChannel,
  MessageSendRecord,
  AutoSendRule,
} from '@/types/message'
import { messageStorage } from '@/services/messageStorage'

interface MessageContextValue {
  templates: MessageTemplate[]
  activeTemplates: MessageTemplate[]
  sendRecords: MessageSendRecord[]
  autoSendRules: AutoSendRule[]
  sendStats: { total: number; sent: number; failed: number; pending: number }
  refresh: () => void
  getTemplateById: (id: string) => MessageTemplate | undefined
  createTemplate: (data: {
    name: string
    category: TemplateCategory
    channel: MessageChannel
    content: string
    variables: string[]
  }) => MessageTemplate
  updateTemplate: (
    id: string,
    data: Partial<Pick<MessageTemplate, 'name' | 'category' | 'channel' | 'content' | 'variables' | 'isActive'>>
  ) => void
  deleteTemplate: (id: string) => void
  sendMessage: (data: {
    templateId: string
    templateName: string
    channel: MessageChannel
    recipientName: string
    recipientPhone: string
    content: string
  }) => MessageSendRecord
  sendBulkMessages: (
    recipients: Array<{ name: string; phone: string }>,
    templateId: string,
    templateName: string,
    channel: MessageChannel,
    content: string
  ) => MessageSendRecord[]
  updateAutoSendRule: (id: string, isEnabled: boolean) => void
  updateAutoSendRuleTemplate: (id: string, templateId: string) => void
}

const MessageContext = createContext<MessageContextValue | null>(null)

export function MessageProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [activeTemplates, setActiveTemplates] = useState<MessageTemplate[]>([])
  const [sendRecords, setSendRecords] = useState<MessageSendRecord[]>([])
  const [autoSendRules, setAutoSendRules] = useState<AutoSendRule[]>([])
  const [sendStats, setSendStats] = useState(messageStorage.getSendStats())

  const refresh = useCallback(() => {
    setTemplates(messageStorage.getTemplates())
    setActiveTemplates(messageStorage.getActiveTemplates())
    setSendRecords(messageStorage.getSendRecords())
    setAutoSendRules(messageStorage.getAutoSendRules())
    setSendStats(messageStorage.getSendStats())
  }, [])

  useEffect(() => {
    messageStorage.seedDemoData()
    refresh()
  }, [refresh])

  const getTemplateById = useCallback(
    (id: string) => messageStorage.getTemplateById(id),
    []
  )

  const createTemplate = useCallback(
    (data: { name: string; category: TemplateCategory; channel: MessageChannel; content: string; variables: string[] }) => {
      const template = messageStorage.createTemplate(data)
      refresh()
      return template
    },
    [refresh]
  )

  const updateTemplate = useCallback(
    (id: string, data: Partial<Pick<MessageTemplate, 'name' | 'category' | 'channel' | 'content' | 'variables' | 'isActive'>>) => {
      messageStorage.updateTemplate(id, data)
      refresh()
    },
    [refresh]
  )

  const deleteTemplate = useCallback(
    (id: string) => {
      messageStorage.deleteTemplate(id)
      refresh()
    },
    [refresh]
  )

  const sendMessage = useCallback(
    (data: { templateId: string; templateName: string; channel: MessageChannel; recipientName: string; recipientPhone: string; content: string }) => {
      const record = messageStorage.createSendRecord(data)
      refresh()
      return record
    },
    [refresh]
  )

  const sendBulkMessages = useCallback(
    (recipients: Array<{ name: string; phone: string }>, templateId: string, templateName: string, channel: MessageChannel, content: string) => {
      const records = messageStorage.createBulkSendRecords(recipients, templateId, templateName, channel, content)
      refresh()
      return records
    },
    [refresh]
  )

  const updateAutoSendRule = useCallback(
    (id: string, isEnabled: boolean) => {
      messageStorage.updateAutoSendRule(id, isEnabled)
      refresh()
    },
    [refresh]
  )

  const updateAutoSendRuleTemplate = useCallback(
    (id: string, templateId: string) => {
      messageStorage.updateAutoSendRuleTemplate(id, templateId)
      refresh()
    },
    [refresh]
  )

  return (
    <MessageContext.Provider
      value={{
        templates,
        activeTemplates,
        sendRecords,
        autoSendRules,
        sendStats,
        refresh,
        getTemplateById,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        sendMessage,
        sendBulkMessages,
        updateAutoSendRule,
        updateAutoSendRuleTemplate,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages() {
  const ctx = useContext(MessageContext)
  if (!ctx) throw new Error('useMessages must be used within MessageProvider')
  return ctx
}
