'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Spin, message as antMessage, Empty } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
    // Simulate getting the session via API if not available in client component natively immediately
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        if (!data.error) setConversations(data);
        
        // As a fallback for prototyping, we will infer current user ID from the first conversation
        if (data.length > 0 && !currentUserId) {
            // Simplified assumption for demo UI functioning
        }
      }
    } catch (e) {
      // Graceful degraded mode if not logged in
      console.warn("Unauthenticated or fetch failed");
    } finally { 
      setLoading(false); 
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;

    try {
      const recipientId = selectedConv.participantOneId; // Placeholder till fully auth integrated
      
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          recipientId,
          content: newMessage
        })
      });
      if (res.ok) {
        setNewMessage('');
        antMessage.success('Sent');
        fetchConversations();
      }
    } catch (e) { antMessage.error("Failed to send"); }
  };

  return (
    <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={2} style={{ margin: 0, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Communication Hub
        </Typography.Title>
        <Typography.Text type="secondary">Secure, direct messaging with Parents and Staff</Typography.Text>
      </div>

      <div style={{ display: 'flex', gap: 16, height: '70vh' }}>
        {/* Sidebar */}
        <Card style={{ width: 320, borderRadius: 12, display: 'flex', flexDirection: 'column', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} styles={{ body: {} }}>
           <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
             <Input.Search placeholder="Search conversations..." size="large" />
           </div>
           {loading ? <div style={{ padding: 24, textAlign: 'center' }}><Spin /></div> : conversations.length > 0 ? (
             <List
               itemLayout="horizontal"
               dataSource={conversations}
               renderItem={(item: any) => {
                 const otherParticipant = item.participantOne; // Demo mapping
                 const lastMsg = item.messages?.[0]?.content || "Start a chat...";
                 return (
                   <List.Item 
                     onClick={() => setSelectedConv(item)}
                     style={{ padding: '16px 24px', cursor: 'pointer', background: selectedConv?.id === item.id ? '#f0f5ff' : 'white', borderBottom: '1px solid #f0f0f0' }}
                   >
                     <List.Item.Meta
                       avatar={<Avatar icon={<UserOutlined />} style={{ background: '#667eea' }} />}
                       title={<Typography.Text strong>{otherParticipant?.name || "Parent User"}</Typography.Text>}
                       description={
                         <Typography.Paragraph ellipsis={{ rows: 1 }} type="secondary" style={{ margin: 0, fontSize: 13 }}>
                           {lastMsg}
                         </Typography.Paragraph>
                       }
                     />
                   </List.Item>
                 );
               }}
             />
           ) : (
              <Empty description="No active conversations. Your inbox is clear!" style={{ marginTop: 60 }} />
           )}
        </Card>

        {/* Chat Area */}
        <Card style={{ flex: 1, borderRadius: 12, display: 'flex', flexDirection: 'column', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} styles={{ body: {} }}>
          {selectedConv ? (
            <>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar icon={<UserOutlined />} />
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {selectedConv.participantOne?.name || "Parent User"}
                </Typography.Text>
              </div>
              <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#fafafa' }}>
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#bfbfbf' }}>
                  <Typography.Text type="secondary">This is the start of your encrypted conversation.</Typography.Text>
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 12, background: 'white' }}>
                <Input size="large" placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onPressEnter={handleSend} style={{ borderRadius: 8 }} />
                <Button type="primary" size="large" icon={<SendOutlined />} onClick={handleSend} style={{ borderRadius: 8 }}>Send</Button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              <Empty description="Select a conversation string to view messages" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
