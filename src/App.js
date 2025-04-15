import React, { useState } from "react";
import Tesseract from "tesseract.js"; // For OCR (image to text extraction)
import mammoth from "mammoth"; // For DOCX file parsing
import "./style.css"; // Import the styles

// Predefined Themes
const colorThemes = {
  "Iridescent Dawn": {
    label: "Iridescent Dawn",
    background: "linear-gradient(to bottom right, #fef6ff, #e6f2ff)",
    textColor: "#444",
    font: "'Cormorant Garamond', serif",
  },
  "Terracotta Soul": {
    label: "Terracotta Soul",
    background: "linear-gradient(to bottom right, #fff4e6, #f6d9c2)",
    textColor: "#4b2e2e",
    font: "'Spectral', serif",
  },
  "Deep Ocean Ink": {
    label: "Deep Ocean Ink",
    background: "linear-gradient(to bottom right, #0f1c2e, #1b2a3a)",
    textColor: "#cdd6f4",
    font: "'EB Garamond', serif",
  },
};

// Correcting Punctuation Function
function correctPunctuation(text) {
  text = text.replace(/\s([.,!?;:])/g, "$1");
  text = text.replace(/([.,!?;:])([^\s])/g, "$1 $2");
  text = text.replace(/\s+/g, " ").trim();
  if (text && ![".", "?", "!"].includes(text.charAt(text.length - 1))) {
    text += ".";
  }
  return text;
}

// Poem Layout Component
function Volume2PoemLayout({ poem, theme }) {
  const styles = {
    background: theme?.background || "#fff",
    color: theme?.textColor || "#222",
    fontFamily: theme?.font || "'Georgia', serif",
    padding: "2rem",
    minHeight: "100vh",
    transition: "all 0.5s ease",
    lineHeight: "1.8",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={styles} className="poem-layout">
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{poem.title}</h1>
      <div>
        {poem.lines.map((line, i) => (
          <p key={i} style={{ marginBottom: "0.75rem" }}>
            {line}
          </p>
        ))}
        <p
          style={{ fontStyle: "italic", marginTop: "2rem", textAlign: "right" }}
        >
          - {poem.signature || "Erring Soul"}
        </p>
      </div>
    </div>
  );
}

// Theme Selector Component
function Volume2StyleSelector({
  onSelect,
  onPreview,
  themeSelection,
  setThemeSelection,
}) {
  const handleThemeChange = (e) => {
    const selected = e.target.value;
    setThemeSelection(selected); // Set the selected theme
    onPreview(
      colorThemes[selected] || {
        background: "#fff",
        textColor: "#222",
        font: "'Georgia', serif",
      }
    ); // Default empty theme for custom
    onSelect(
      colorThemes[selected] || {
        background: "#fff",
        textColor: "#222",
        font: "'Georgia', serif",
      }
    );
  };

  return (
    <div className="theme-selector">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        🖌️ Choose a Theme (Preview):
      </label>
      <select
        onChange={handleThemeChange}
        className="theme-dropdown"
        value={themeSelection}
      >
        {Object.keys(colorThemes).map((key) => (
          <option key={key} value={key}>
            {colorThemes[key].label}
          </option>
        ))}
        <option value="custom">Custom Theme</option> {/* Custom Theme option */}
      </select>

      {/* Live Preview Box */}
      <div
        className="theme-preview-box"
        style={{
          background: colorThemes[themeSelection]?.background || "#fff",
          color: colorThemes[themeSelection]?.textColor || "#222",
          fontFamily: colorThemes[themeSelection]?.font || "'Georgia', serif",
        }}
      >
        <div className="theme-content">
          <h3>{colorThemes[themeSelection]?.label || "Custom Theme"}</h3>
        </div>
      </div>
    </div>
  );
}

// Custom Theme Input Component
function CustomThemeInput({ onApply }) {
  const [background, setBackground] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [font, setFont] = useState("'Georgia', serif");

  const handleApply = () => {
    onApply({ background, textColor, font });
  };

  return (
    <div className="custom-theme-input">
      <h3>Create Your Custom Theme</h3>
      <label>Background Color:</label>
      <input
        type="color"
        value={background}
        onChange={(e) => setBackground(e.target.value)}
      />
      <label>Text Color:</label>
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
      />
      <label>Font:</label>
      <select value={font} onChange={(e) => setFont(e.target.value)}>
        <option value="'Georgia', serif">Georgia</option>
        <option value="'Arial', sans-serif">Arial</option>
        <option value="'Courier New', monospace">Courier New</option>
        <option value="'Roboto', sans-serif">Roboto</option>
        <option value="'Open Sans', sans-serif">Open Sans</option>
        <option value="'Merriweather', serif">Merriweather</option>
        <option value="'Lora', serif">Lora</option>
      </select>
      <button onClick={handleApply}>Apply Custom Theme</button>
    </div>
  );
}

// Main App Component
function App() {
  const [theme, setTheme] = useState({
    background: "linear-gradient(to bottom right, #fef6ff, #e6f2ff)",
    textColor: "#444",
    font: "'Cormorant Garamond', serif",
  });

  const [poemData, setPoemData] = useState([]); // Store multiple poems
  const [poemContent, setPoemContent] = useState(""); // State for manually added poems
  const [themeSelection, setThemeSelection] = useState("Iridescent Dawn"); // Default theme

  // Function to handle file upload (including .docx files)
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 15) {
      alert("You can only upload up to 15 files at once.");
      return;
    }

    const newPoemData = [];

    // Loop through each file to process it
    Array.from(files).forEach((file) => {
      const fileType = file.type;

      if (fileType === "text/plain") {
        const reader = new FileReader();
        reader.onload = () => {
          const text = correctPunctuation(reader.result); // Apply punctuation correction
          newPoemData.push({
            title: "Uploaded Poem",
            lines: text.split("\n"),
            signature: "Erring Soul",
          });
          setPoemData([...newPoemData]);
        };
        reader.readAsText(file);
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          mammoth
            .extractRawText({ arrayBuffer: arrayBuffer })
            .then((result) => {
              const text = correctPunctuation(result.value);
              const lines = text.split("\n");
              newPoemData.push({
                title: "Uploaded DOCX Poem",
                lines: lines,
                signature: "Erring Soul",
              });
              setPoemData([...newPoemData]);
            })
            .catch((err) => {
              console.error("Error parsing DOCX:", err);
            });
        };
        reader.readAsArrayBuffer(file);
      } else if (fileType.startsWith("image/")) {
        handleImageUpload(file, newPoemData);
      }
    });
  };

  const handlePoemSubmit = () => {
    const newPoem = {
      title: "Custom Poem Title", // Example title
      lines: poemContent.split("\n"),
      signature: "Erring Soul",
    };
    setPoemData([newPoem, ...poemData]); // Add new poem to existing poems
  };

  // Handle image file parsing (OCR using Tesseract.js)
  const handleImageUpload = (file, newPoemData) => {
    Tesseract.recognize(file, "eng", { logger: (m) => console.log(m) }).then(
      ({ data: { text } }) => {
        const correctedText = correctPunctuation(text); // Apply punctuation correction
        newPoemData.push({
          title: "Extracted Poem",
          lines: correctedText.split("\n"),
          signature: "Erring Soul",
        });
        setPoemData([...newPoemData]);
      }
    );
  };

  // Applying the custom theme
  const applyCustomTheme = (customTheme) => {
    setTheme(customTheme);
    setThemeSelection("custom"); // Update the theme selection
  };

  return (
    <div
      className="App"
      style={{
        background: theme.background,
        color: theme.textColor,
        fontFamily: theme.font,
      }}
    >
      <div className="hero">
        <h1>Poetic Notebook</h1>

        <Volume2StyleSelector
          onSelect={setTheme}
          onPreview={setTheme}
          themeSelection={themeSelection}
          setThemeSelection={setThemeSelection}
        />

        {/* Custom Theme Dropdown */}
        {themeSelection === "custom" && (
          <CustomThemeInput onApply={applyCustomTheme} />
        )}

        <div className="upload-section">
          <input
            type="file"
            accept=".txt, .pdf, .docx, image/*"
            multiple
            onChange={handleFileUpload}
          />
          <textarea
            value={poemContent}
            onChange={(e) => setPoemContent(e.target.value)}
            placeholder="Write your poem here..."
          />
          <button onClick={handlePoemSubmit}>Submit Poem</button>
        </div>

        {/* Render Poems */}
        {poemData.length > 0 && (
          <div className="poem-display">
            {poemData.map((poem, index) => (
              <div key={index} className="poem-card">
                <h3>{poem.title}</h3>
                {poem.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <p>
                  <em>- {poem.signature}</em>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Example Poem Preview */}
        {poemData.length > 0 && (
          <Volume2PoemLayout poem={poemData[0]} theme={theme} />
        )}
      </div>
    </div>
  );
}

export default App;
