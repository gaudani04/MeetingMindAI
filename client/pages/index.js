import { useState } from 'react';
import axios from 'axios';
import useAudioWebSocket from '../hooks/useAudioWebSocket';
import { Mic, Upload, Square, Download, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const { isRecording, transcript: liveTranscript, startRecording, stopRecording } = useAudioWebSocket();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [chatQ, setChatQ] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/upload', formData);
      setMeetingData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatQ) return;
    const q = chatQ;
    setChatQ('');
    setChatHistory(prev => [...prev, { role: 'user', text: q }]);

    try {
      const res = await axios.post('http://localhost:8000/api/chat', {
        meeting_id: meetingData.id,
        question: q
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (err) {
      console.error(err);
    }
  };

  const exportText = () => {
    const text = `Meeting: ${meetingData.insights.title}\n\nSummary:\n${meetingData.insights.summary.join('\n')}`;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
          <MessageSquare /> Smart Meeting Notes AI
        </h1>
      </header>

      {!meetingData ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Real-time Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Live Meeting</h2>
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isRecording ? <><Square size={20}/> Stop Recording</> : <><Mic size={20}/> Start Recording</>}
            </button>
            <div className="mt-6 bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto">
              <p className="text-gray-600 whitespace-pre-wrap">{liveTranscript || "Transcript will appear here..."}</p>
            </div>
          </div>

          {/* Upload Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Upload Audio/Video</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center flex flex-col items-center justify-center gap-4">
              <Upload size={32} className="text-gray-400" />
              <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="audio/*,video/*" className="text-sm text-gray-500" />
              <button 
                onClick={handleUpload}
                disabled={!file || loading}
                className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Processing via AI..." : "Upload & Analyze"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Meeting Dashboard */
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{meetingData.insights.title}</h2>
                <button onClick={exportText} className="text-blue-600 hover:text-blue-800 flex items-center gap-1"><Download size={18} /> Export</button>
              </div>
              
              <h3 className="font-semibold text-lg mt-4 mb-2">Summary</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-6">
                {meetingData.insights.summary.map((s, i) => <li key={i}>{s}</li>)}
              </ul>

              <h3 className="font-semibold text-lg mt-4 mb-2">Action Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3">Task</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetingData.insights.action_items.map((item, i) => (
                      <tr key={i} className="border-b text-gray-700">
                        <td className="p-3">{item.task}</td>
                        <td className="p-3"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{item.owner}</span></td>
                        <td className="p-3 text-sm">{item.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-lg mt-6 mb-2">Risks & Concerns</h3>
              <ul className="list-disc pl-5 space-y-1 text-red-600">
                {meetingData.insights.risks.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>

          {/* Chat System */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
            <h2 className="text-xl font-semibold mb-4">Chat with Notes</h2>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {chatHistory.length === 0 && <p className="text-gray-400 text-sm text-center mt-10">Ask anything about this meeting!</p>}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white ml-auto max-w-[85%]' : 'bg-gray-100 text-gray-800 mr-auto max-w-[95%]'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatQ} 
                onChange={(e) => setChatQ(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask a question..." 
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <button onClick={handleChat} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">Ask</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}