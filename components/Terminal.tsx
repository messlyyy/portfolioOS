'use client';

import { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  id: number;
  content: string | JSX.Element;
  type: 'input' | 'output' | 'system';
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [userIP, setUserIP] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);

  // Función para obtener la IP del usuario
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setUserIP(data.ip))
      .catch(() => setUserIP('Unable to fetch'));
  }, []);

  // Mostrar neofetch al inicio
  useEffect(() => {
    const neofetch = (
      <div className="text-gray-800">
        <div className="flex gap-4 mb-4">
          <div className="text-4xl">
            <div>⠀⠀⠀⣀⣀⣤⣤⣦⣶⢶⣶⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⡄⠀⠀⠀⠀</div>
            <div>⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀</div>
            <div>⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀</div>
            <div>⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀</div>
          </div>
          <div className="flex-1 space-y-1 text-sm">
            <div><span className="text-blue-600 font-bold">guest</span><span className="text-gray-600">@</span><span className="text-blue-600 font-bold">portfolio-os</span></div>
            <div className="text-gray-600">─────────────────</div>
            <div><span className="font-semibold">OS:</span> Portfolio OS v1.0.0</div>
            <div><span className="font-semibold">Host:</span> Web Browser</div>
            <div><span className="font-semibold">Kernel:</span> React 18.2</div>
            <div><span className="font-semibold">Uptime:</span> {new Date().toLocaleTimeString()}</div>
            <div><span className="font-semibold">Shell:</span> websh 1.0</div>
            <div><span className="font-semibold">Terminal:</span> portfolio-term</div>
            <div><span className="font-semibold">CPU:</span> {navigator.hardwareConcurrency || 'N/A'} cores</div>
            <div><span className="font-semibold">Memory:</span> {(navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'N/A'}</div>
          </div>
        </div>
      </div>
    );

    addLine(neofetch, 'system');
    addLine('', 'system');
    addLine("Type 'help' to see available commands.", 'system');
    addLine('', 'system');
  }, []);

  const addLine = (content: string | JSX.Element, type: TerminalLine['type']) => {
    setLines((prev) => [...prev, { id: lineIdRef.current++, content, type }]);
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();

    // Añadir comando al historial
    if (trimmedCmd) {
      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);
    }

    // Mostrar el input del usuario
    addLine(`guest@portfolio-os:~$ ${trimmedCmd}`, 'input');

    if (!trimmedCmd) {
      return;
    }

    const [command, ...args] = trimmedCmd.split(' ');

    switch (command.toLowerCase()) {
      case 'help':
        addLine('Available commands:', 'output');
        addLine('  help       - Show this help message', 'output');
        addLine('  clear      - Clear the terminal screen', 'output');
        addLine('  ip         - Show your public IP address', 'output');
        addLine('  neofetch   - Display system information', 'output');
        addLine('  whoami     - Display current user', 'output');
        addLine('  date       - Display current date and time', 'output');
        addLine('  echo       - Echo a message', 'output');
        addLine('  about      - About this portfolio', 'output');
        addLine('', 'output');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'ip':
        if (userIP) {
          addLine(`Your public IP address: ${userIP}`, 'output');
        } else {
          addLine('Fetching IP address...', 'output');
        }
        addLine('', 'output');
        break;

      case 'neofetch':
        const neofetch = (
          <div className="text-gray-800">
            <div className="flex gap-4 mb-4">
              <div className="text-4xl">
                <div>⠀⠀⠀⣀⣀⣤⣤⣦⣶⢶⣶⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⡄⠀⠀⠀⠀</div>
                <div>⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀</div>
                <div>⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀</div>
                <div>⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀</div>
              </div>
              <div className="flex-1 space-y-1 text-sm">
                <div><span className="text-blue-600 font-bold">guest</span><span className="text-gray-600">@</span><span className="text-blue-600 font-bold">portfolio-os</span></div>
                <div className="text-gray-600">─────────────────</div>
                <div><span className="font-semibold">OS:</span> Portfolio OS v1.0.0</div>
                <div><span className="font-semibold">Host:</span> Web Browser</div>
                <div><span className="font-semibold">Kernel:</span> React 18.2</div>
                <div><span className="font-semibold">Uptime:</span> {new Date().toLocaleTimeString()}</div>
                <div><span className="font-semibold">Shell:</span> websh 1.0</div>
                <div><span className="font-semibold">Terminal:</span> portfolio-term</div>
                <div><span className="font-semibold">CPU:</span> {navigator.hardwareConcurrency || 'N/A'} cores</div>
                <div><span className="font-semibold">Memory:</span> {(navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'N/A'}</div>
              </div>
            </div>
          </div>
        );
        addLine(neofetch, 'output');
        addLine('', 'output');
        break;

      case 'whoami':
        addLine('guest', 'output');
        addLine('', 'output');
        break;

      case 'date':
        addLine(new Date().toString(), 'output');
        addLine('', 'output');
        break;

      case 'echo':
        addLine(args.join(' '), 'output');
        addLine('', 'output');
        break;

      case 'about':
        addLine('Portfolio OS - Interactive Terminal', 'output');
        addLine('Created with React, Next.js, and Tailwind CSS', 'output');
        addLine('This is a web-based terminal emulator for my portfolio', 'output');
        addLine('', 'output');
        break;

      default:
        addLine(`Command not found: ${command}`, 'output');
        addLine("Type 'help' for available commands.", 'output');
        addLine('', 'output');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(currentInput);
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Auto-scroll al final
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus en el input cuando se hace click en el terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="h-full bg-white p-4 font-mono text-sm overflow-auto cursor-text"
      onClick={handleTerminalClick}
      ref={terminalRef}
    >
      <div className="space-y-1">
        {lines.map((line) => (
          <div
            key={line.id}
            className={
              line.type === 'input'
                ? 'text-gray-900 font-semibold'
                : line.type === 'output'
                ? 'text-gray-700'
                : 'text-gray-800'
            }
          >
            {line.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-1">
        <div className="flex items-center text-gray-900">
          <span className="text-blue-600 font-semibold">guest</span>
          <span className="text-gray-600">@</span>
          <span className="text-blue-600 font-semibold">portfolio-os</span>
          <span className="text-gray-600">:</span>
          <span className="text-green-600 font-semibold">~</span>
          <span className="text-gray-600 ml-1">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 ml-2 bg-transparent outline-none text-gray-900"
            autoFocus
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}
