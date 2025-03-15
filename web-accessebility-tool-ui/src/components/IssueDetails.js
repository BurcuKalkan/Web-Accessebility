import React, { useState, useEffect } from "react";
import "./IssueDetails.css";

const IssueDetails = ({ pa11yResult }) => {
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [selectedTab, setSelectedTab] = useState("error");
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [fgAlpha, setFgAlpha] = useState(1.0);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Received message:", event.data);
      event.data.type &&
        event.data.id &&
        selectAndScrollToElement(event.data.id, event.data.type);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleElementClick = (element) => {
    const iframe = document.querySelector(".iframe-container iframe");
    if (iframe) {
      try {
        iframe.contentWindow.postMessage(
          {
            type: "selectMarker",
            selector: element.selector,
            msgtype: element.type,
            id: element.id,
          },
          "*"
        );
      } catch (error) {
        console.error("Error communicating with iframe:", error);
        alert(
          "Unable to highlight element due to security restrictions. Please try a different browser or website."
        );
      }
    }
    const message = `Failing Element Details:
      Selector: ${element.selector}
      Element: ${element.element}
      Context: ${element.context}
      Message: ${element.message}
      Code: ${element.code}`;
    // console.log(message);
  };

  const handleSelectClick = (element) => {
    setSelectedElement(element);
    setIsSelectModalOpen(true);
  };

  const handleSelectModalClose = () => {
    setSelectedElement(null);
    setIsSelectModalOpen(false);
  };

  const updateElementColors = () => {
    if (selectedElement && selectedElement.elementNode) {
      const element = selectedElement.elementNode;
      element.style.backgroundColor = bgColor;
      element.style.color = `rgba(${parseInt(
        fgColor.slice(1, 3),
        16
      )}, ${parseInt(fgColor.slice(3, 5), 16)}, ${parseInt(
        fgColor.slice(5, 7),
        16
      )}, ${fgAlpha})`;
    }
  };

  useEffect(() => {
    removeMarkers();
    Object.entries(issueData[selectedTab]).forEach(([category, issues]) => {
      issues.forEach((issue, index1) => {
        issue.items.forEach((element, index2) => {
          insertMarker(element);
        });
      });
    });
  }, [selectedTab]);

  const insertMarker = (element) => {
    const iframe = document.querySelector(".iframe-container iframe");
    if (iframe) {
      try {
        iframe.contentWindow.postMessage(
          {
            type: "addMarker",
            selector: element.selector,
            msgtype: element.type,
            id: element.id,
          },
          "*"
        );
      } catch (error) {
        console.error("Error communicating with iframe:", error);
        alert(
          "Unable to highlight element due to security restrictions. Please try a different browser or website."
        );
      }
    }
  };

  const removeMarkers = () => {
    const iframe = document.querySelector(".iframe-container iframe");
    if (iframe) {
      try {
        iframe.contentWindow.postMessage(
          {
            type: "removeMarkers",
          },
          "*"
        );
      } catch (error) {
        console.error("Error communicating with iframe:", error);
        alert(
          "Unable to highlight element due to security restrictions. Please try a different browser or website."
        );
      }
    }
  };

  const issueData = pa11yResult;

  const toggleIssue = (issueId) => {
    setExpandedIssue(expandedIssue === issueId ? null : issueId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "error":
        return "#dc3545";
      case "warning":
        return "#ffc107";
      case "notice":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "error":
        return "🚨";
      case "warning":
        return "⚠️";
      case "notice":
        return "✅";
      default:
        return "❔";
    }
  };

  const selectAndScrollToElement = (elementId, type) => {
    // Find the element in the issue data
    const element = Object.values(issueData[type])
      .flatMap((issues) => issues)
      .flatMap((issue) => issue.items)
      .find((element) => element.id === elementId);

    if (element) {
      // Expand the parent issue
      toggleIssue(element.parentId);

      // Wait for the transition to complete (200ms is the transition duration)
      setTimeout(() => {
        // Scroll to the element
        const elementNode = document.querySelector(
          `[data-element-id="${elementId}"]`
        );
        if (elementNode) {
          elementNode.scrollIntoView({ behavior: "smooth", block: "center" });
          elementNode.focus();
        }

        // Select the marker in the iframe
        const iframe = document.querySelector(".iframe-container iframe");
        if (iframe) {
          try {
            iframe.contentWindow.postMessage(
              {
                type: "selectMarker",
                selector: element.selector,
                msgtype: element.type,
                id: element.id,
              },
              "*"
            );
          } catch (error) {
            console.error("Error communicating with iframe:", error);
            alert(
              "Unable to highlight element due to security restrictions. Please try a different browser or website."
            );
          }
        }
      }, 200); // Wait for the transition to complete
    }
  };

  function RGBAtoRGB(e, t) {
    const n = {
        r: getRGB(e.substring(0, 2)),
        g: getRGB(e.substring(2, 4)),
        b: getRGB(e.substring(4, 6)),
        a: getRGB(e.substring(6, 8)) / 255,
      },
      a = getRGB(t.substring(0, 2)),
      i = getRGB(t.substring(2, 4)),
      o = getRGB(t.substring(4, 6));
    var s = n.a;
    isNaN(s) && (s = 1);
    var r = Math.round((1 - s) * a + s * n.r),
      l = Math.round((1 - s) * i + s * n.g),
      c = Math.round((1 - s) * o + s * n.b);
    return (
      ("0" + r.toString(16)).slice(-2) +
      ("0" + l.toString(16)).slice(-2) +
      ("0" + c.toString(16)).slice(-2)
    );
  }

  function getL(e) {
    return (
      0.2126 * getsRGB(e.substring(0, 2)) +
      0.7152 * getsRGB(e.substring(2, 4)) +
      0.0722 * getsRGB(e.substring(4, 6))
    );
  }

  function Dec2(e) {
    if (-1 !== (e = String(e)).indexOf(".")) {
        var t = e.split(".");
        return 1 == t.length ? Number(e) : Number(t[0] + "." + t[1].charAt(0) + t[1].charAt(1))
    }
    return Number(e)
}

function getsRGB(e) {
  return e = (e = getRGB(e) / 255) <= .03928 ? e / 12.92 : Math.pow((e + .055) / 1.055, 2.4)
}

function getRGB(e) {
  try {
      e = parseInt(e, 16)
  } catch (t) {
      e = !1
  }
  return e
}
  function calculateContrast(f,b) {
    var e = getL(RGBAtoRGB(f, b)),
      t = getL(b),
      n = (Math.max(e, t) + 0.05) / (Math.min(e, t) + 0.05);
    return n;
  }

  function extractContrastRatio(text) {
    const match = text.match(/(\d+(\.\d+)?\s*:\s*1)/);
    return match ? match[1].trim() : null;
}

  return (
    <div className="issue-details">
      <div className="issue-tabs">
        <button
          className={`${selectedTab === "error" ? "active" : ""}`}
          onClick={() => setSelectedTab("error")}
        >
          <span className="tab-icon">🚨</span>
          Critical Issues
        </button>
        <button
          className={`${selectedTab === "warning" ? "active" : ""}`}
          onClick={() => setSelectedTab("warning")}
        >
          <span className="tab-icon">⚠️</span>
          Warnings
        </button>
        <button
          className={`${selectedTab === "notice" ? "active" : ""}`}
          onClick={() => setSelectedTab("notice")}
        >
          <span className="tab-icon">✅</span>
          Notices
        </button>
      </div>

      {Object.entries(issueData[selectedTab]).map(([category, issues]) => (
        <div key={category} className="issue-category">
          <h2>
            <span className="category-icon">{getStatusIcon(selectedTab)}</span>
            Principle: {category}
          </h2>
          <div className="issues-list">
            {issues.map((issue) => (
              <div key={issue.id} className="issue-item">
                <div
                  className="issue-header"
                  onClick={() => toggleIssue(issue.id)}
                >
                  <div className="issue-summary">
                    <div className="issue-number">#{issue.id}</div>
                    <div className="issue-icon">
                      {getStatusIcon(selectedTab)}
                    </div>
                    <div className="issue-title">
                      Guideline: {issue.guideline}
                    </div>
                  </div>
                  <div className="issue-meta">
                    <div
                      className="elements-count"
                      style={{
                        background: `${getStatusColor(selectedTab)}15`,
                        color: getStatusColor(selectedTab),
                      }}
                    >
                      {issue.totalElements}
                    </div>
                    <div className="disabilities">
                      {issue.disabilities.map((disability, index) => (
                        <span key={index} className="disability-tag">
                          {disability}
                        </span>
                      ))}
                    </div>
                    <div className="criteria">
                      {issue.criteria.map((criterion, index) => (
                        <span key={index} className="criteria-tag">
                          {criterion}
                        </span>
                      ))}
                    </div>
                    {issue.items.length > 0 && (
                      <div className="expand-icon">
                        {expandedIssue === issue.id ? "▼" : "▶"}
                      </div>
                    )}
                  </div>
                </div>
                {expandedIssue === issue.id && issue.items.length > 0 && (
                  <div className="failing-elements">
                    <h3>Failing Elements:</h3>
                    {issue.items.map((element, index) => (
                      <div
                        key={element.id}
                        className="failing-element"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleElementClick(element)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleElementClick(element);
                          }
                        }}
                        data-element-id={element.id}
                      >
                       { (element.code.includes("BgImage") || (element.message.includes("contrast ratio"))) && (<div className="element-number-container">
                          <div className="element-number">{index + 1}</div>
                          <button
                            className="select-button"
                            onClick={() => handleSelectClick(element)}
                          >
                            <span className="icon">⚙️</span>
                          </button>
                        </div>)}
                        <div className="element-details">
                          <div className="element-title">Selector</div>
                          <div className="element-selector">
                            {element.selector}
                          </div>
                          <div className="element-title">Context</div>
                          <div className="element-code">{element.context}</div>
                          <div className="element-title">Message</div>
                          <div className="element-message">
                            {element.message}
                          </div>
                          <div className="element-title">Code</div>
                          <div className="element-code">{element.code}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {isSelectModalOpen && selectedElement && (
        <div className="modal-overlay" onClick={handleSelectModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contrast Details</h3>
              <button className="modal-close" onClick={handleSelectModalClose}>
                <span className="icon">❌</span>
              </button>
            </div>
            <div className="modal-body">

              <div className="modal-section">
                <h4>Element</h4>
                <div
                  className="rendered-element"
                  style={{
                    backgroundColor: bgColor,
                    color: `rgba(${parseInt(
                      fgColor.slice(1, 3),
                      16
                    )}, ${parseInt(fgColor.slice(3, 5), 16)}, ${parseInt(
                      fgColor.slice(5, 7),
                      16
                    )}, ${fgAlpha})`,
                  }}
                >
                  {selectedElement.context ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedElement.context,
                      }}
                    />
                  ) : (
                    <p>No element found</p>
                  )}
                </div>
              </div>
              <div className="modal-section">
                <h4>Contrast Ratio: { Dec2((100 * (calculateContrast(fgColor.split("#")[1], bgColor.split("#")[1]))) / 100) + ":1" }</h4>
                <h4>AA ({extractContrastRatio(selectedElement.message)}): {(calculateContrast(fgColor.split("#")[1], bgColor.split("#")[1])) >= parseFloat(extractContrastRatio(selectedElement.message)) ? "Pass" : "Fail"}</h4>                 
              </div>

              <div className="modal-section">
                <h4>Background Color</h4>
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      updateElementColors();
                    }}
                    className="color-picker"
                  />
                  <input
                    type="range"
                    min="0"
                    max="16777215"
                    value={parseInt(bgColor.replace("#", ""), 16)}
                    onChange={(e) => {
                      const hex = parseInt(e.target.value)
                        .toString(16)
                        .padStart(6, "0");
                      setBgColor(`#${hex}`);
                      updateElementColors();
                    }}
                    className="color-slider"
                  />
                </div>
              </div>
              <div className="modal-section">
                <h4>Foreground Color</h4>
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => {
                      setFgColor(e.target.value);
                      updateElementColors();
                    }}
                    className="color-picker"
                  />
                  <input
                    type="range"
                    min="0"
                    max="16777215"
                    value={parseInt(fgColor.replace("#", ""), 16)}
                    onChange={(e) => {
                      const hex = parseInt(e.target.value)
                        .toString(16)
                        .padStart(6, "0");
                      setFgColor(`#${hex}`);
                      updateElementColors();
                    }}
                    className="color-slider"
                  />
                  <div className="alpha-container">
                    <label htmlFor="alpha">Alpha:</label>
                    <input
                      type="number"
                      id="alpha"
                      min="0"
                      max="1"
                      step="0.01"
                      value={fgAlpha}
                      onChange={(e) => {
                        setFgAlpha(parseFloat(e.target.value));
                        updateElementColors();
                      }}
                      className="alpha-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetails;
