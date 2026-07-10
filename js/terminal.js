// ---------- DATI DELLO SCRIPT (personalizza qui i tuoi contenuti) ----------
const script = [
  {
    cmd: 'whoami',
    output: ['Michelangelo Drago'],
    outputClass: 'output-text'
  },
  {
    cmd: 'cat about.txt',
    output: [
      'Graphic Designer & Web Developer & Photography',
      'Ogni idea è realizzabile soprattutto graficamente'
    ],
    outputClass: 'output-text'
  },
  {
    cmd: 'ls Skill/',
    output: ['HTML CSS JavaScript Figma Photoshop Git Angular SCSS'],
    outputClass: 'output-text'
  },
  {
    cmd: 'npm list --global --experience',
    output: [
      '├── HTML5 & CSS3       ★★★★★',
      '├── JavaScript (ES6+)  ★★★★☆',
      '├── UI/UX Design       ★★★★★',
      '└── Git & GitHub       ★★★★☆'
    ],
    outputClass: 'output-text'
  },
  {
    cmd: 'echo $STATUS',
    output: ['Disponibile per nuovi progetti ✓'],
    outputClass: 'output-success'
  }
];

const PROMPT_USER = 'michelangelo@portfolio';
const PROMPT_PATH = '~';

// ---------- FUNZIONE RICHIAMABILE OGNI VOLTA CHE SI APRE IL TERMINALE ----------
function runTerminalAnimation(terminalEl) {
  const terminal = terminalEl;
  let scriptIndex = 0;

  function typeCommand(text, onDone) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const prompt = document.createElement('span');
    prompt.innerHTML = `<span class="prompt-symbol">${PROMPT_USER}</span> <span class="prompt-path">${PROMPT_PATH} %</span> `;
    line.appendChild(prompt);

    const cmdSpan = document.createElement('span');
    cmdSpan.className = 'cmd-text';
    line.appendChild(cmdSpan);

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    line.appendChild(cursor);

    terminal.appendChild(line);

    let i = 0;
    const typingSpeed = 45;

    function typeChar() {
      if (i < text.length) {
        cmdSpan.textContent += text[i];
        i++;
        terminal.scrollTop = terminal.scrollHeight;
        setTimeout(typeChar, typingSpeed + Math.random() * 40);
      } else {
        cursor.remove();
        setTimeout(onDone, 300);
      }
    }
    typeChar();
  }

  function printOutput(lines, cssClass, onDone) {
    let i = 0;
    function printLine() {
      if (i < lines.length) {
        const line = document.createElement('div');
        line.className = `terminal-line ${cssClass}`;
        line.textContent = lines[i];
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
        i++;
        setTimeout(printLine, 120);
      } else {
        setTimeout(onDone, 500); // pausa prima del prossimo comando
      }
    }
    printLine();
  }

  function runNextStep() {
    if (scriptIndex >= script.length) {
      // finito lo script: mostra un ultimo prompt con cursore lampeggiante fermo
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = `<span class="prompt-symbol">${PROMPT_USER}</span> <span class="prompt-path">${PROMPT_PATH} %</span> <span class="cursor"></span>`;
      terminal.appendChild(line);
      return;
    }

    const step = script[scriptIndex];
    typeCommand(step.cmd, () => {
      printOutput(step.output, step.outputClass, () => {
        scriptIndex++;
        runNextStep();
      });
    });
  }

  setTimeout(runNextStep, 400);
}