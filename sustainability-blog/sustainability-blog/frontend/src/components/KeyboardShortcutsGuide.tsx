import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useTheme } from '../contexts/ThemeContext';

interface KeyboardShortcutsGuideProps {
  show: boolean;
  onHide: () => void;
}

const KeyboardShortcutsGuide: React.FC<KeyboardShortcutsGuideProps> = ({ show, onHide }) => {
  const modalRef = useFocusTrap(show);
  const { theme } = useTheme();

  const shortcuts = [
    { key: 'h', description: 'Go to Home page' },
    { key: 'b', description: 'Go to Blog page' },
    { key: 'a', description: 'Go to About page' },
    { key: 't', description: 'Toggle theme' },
    { key: '?', description: 'Show/hide keyboard shortcuts' },
    { key: 'Esc', description: 'Close modals or menus' }
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      ref={modalRef}
      aria-labelledby="keyboard-shortcuts-title"
    >
      <Modal.Header 
        closeButton 
        className={`bg-${theme === 'dark' ? 'dark' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'}`}
      >
        <Modal.Title id="keyboard-shortcuts-title">
          Keyboard Shortcuts
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme === 'dark' ? 'dark' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'}`}>
        <Table 
          striped 
          bordered 
          hover 
          variant={theme}
          className="mb-0"
        >
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shortcuts.map((shortcut, index) => (
              <tr key={index}>
                <td>
                  <kbd>{shortcut.key}</kbd>
                </td>
                <td>{shortcut.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default KeyboardShortcutsGuide;