const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const mapping = {
  'user_calendar-0.png': 'User Accounts.png',
  'computer-0.png': 'My Computer.png',
  'directory_open_file_mydocs-0.png': 'My Documents.png',
  'network_drive-0.png': 'Network Drive.png',
  'recycle_bin_empty-0.png': 'Recycle Bin (empty).png',
  'msie1-0.png': 'Internet Explorer 6.png',
  'image_old_jpeg-0.png': 'My Pictures.png',
  'media_player-0.png': 'Windows Media Player 10.png',
  'hard_disk_drive-0.png': 'My Computer.png',
  'cd_drive-0.png': 'Optical Drive.png',
  'settings_gear-0.png': 'Control Panel.png',
  'time_and_date-0.png': 'Date and Time.png',
  'address_book-0.png': 'Address Book.png',
  'notepad-0.png': 'Notepad.png',
  'help_book_small-0.png': 'Help and Support - Index.png',
  'search_file-0.png': 'Search.png',
  'executable-0.png': 'Run.png',
  'printer-0.png': 'Printer.png',
  'stop-0.png': 'Stop.png',
  'desktop-0.png': 'Desktop.png',
  'history-0.png': 'Recent Documents.png',
  'envelope_closed-0.png': 'Outlook Express.png',
  'paint_file-0.png': 'Paint.png',
  'calculator-0.png': 'Calculator.png'
};

Object.keys(mapping).forEach(win98 => {
  const xp = mapping[win98];
  const from = `./95%20all/windows98-icons/png/${win98}`;
  const to = `./Windows XP Icon Pack/Windows XP High Resolution Icon Pack/Windows XP Icons/${xp}`;
  const re = new RegExp(from.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
  content = content.replace(re, to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('index.html updated with XP icon paths');
