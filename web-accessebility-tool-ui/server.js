const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json()); // Add middleware to parse JSON bodies

function explainWCAGCode(code) {
  const wcagGuidelines = {
    Guideline1_1: "Text Alternatives",
    Guideline1_2: "Time-based Media",
    Guideline1_3: "Adaptable",
    Guideline1_4: "Distinguishable",
    Guideline2_1: "Keyboard Accessible",
    Guideline2_2: "Enough Time",
    Guideline2_3: "Seizures and Physical Reactions",
    Guideline2_4: "Navigable",
    Guideline2_5: "Input Modalities",
    Guideline3_1: "Readable",
    Guideline3_2: "Predictable",
    Guideline3_3: "Input Assistance",
    Guideline4_1: "Compatible",
  };

  const wcagSuccessCriteria = {
    "1.1.1": "Non-text Content",
    "1.2.1": "Audio-only and Video-only (Prerecorded)",
    "1.2.2": "Captions (Prerecorded)",
    "1.2.3": "Audio Description or Media Alternative (Prerecorded)",
    "1.2.4": "Captions (Live)",
    "1.2.5": "Audio Description (Prerecorded)",
    "1.2.6": "Sign Language (Prerecorded)",
    "1.2.7": "Extended Audio Description (Prerecorded)",
    "1.2.8": "Media Alternative (Prerecorded)",
    "1.2.9": "Audio-only (Live)",
    "1.3.1": "Info and Relationships",
    "1.3.2": "Meaningful Sequence",
    "1.3.3": "Sensory Characteristics",
    "1.3.4": "Orientation",
    "1.3.5": "Identify Input Purpose",
    "1.4.1": "Use of Color",
    "1.4.2": "Audio Control",
    "1.4.3": "Contrast (Minimum)",
    "1.4.4": "Resize Text",
    "1.4.5": "Images of Text",
    "1.4.6": "Contrast (Enhanced)",
    "1.4.7": "Low or No Background Audio",
    "1.4.8": "Visual Presentation",
    "1.4.9": "Images of Text (No Exception)",
    "1.4.10": "Reflow",
    "1.4.11": "Non-text Contrast",
    "1.4.12": "Text Spacing",
    "1.4.13": "Content on Hover or Focus",
    "2.1.1": "Keyboard",
    "2.1.2": "No Keyboard Trap",
    "2.1.3": "Keyboard (No Exception)",
    "2.2.1": "Timing Adjustable",
    "2.2.2": "Pause, Stop, Hide",
    "2.2.3": "No Timing",
    "2.2.4": "Interruptions",
    "2.2.5": "Re-authenticating",
    "2.2.6": "Timeouts",
    "2.3.1": "Three Flashes or Below Threshold",
    "2.3.2": "Three Flashes",
    "2.3.3": "Animation from Interactions",
    "2.4.1": "Bypass Blocks",
    "2.4.2": "Page Titled",
    "2.4.3": "Focus Order",
    "2.4.4": "Link Purpose (In Context)",
    "2.4.5": "Multiple Ways",
    "2.4.6": "Headings and Labels",
    "2.4.7": "Focus Visible",
    "2.4.8": "Location",
    "2.4.9": "Link Purpose (Link Only)",
    "2.4.10": "Section Headings",
    "2.5.1": "Pointer Gestures",
    "2.5.2": "Pointer Cancellation",
    "2.5.3": "Label in Name",
    "2.5.4": "Motion Actuation",
    "2.5.5": "Target Size",
    "2.5.6": "Concurrent Input Mechanisms",
    "3.1.1": "Language of Page",
    "3.1.2": "Language of Parts",
    "3.1.3": "Unusual Words",
    "3.1.4": "Abbreviations",
    "3.1.5": "Reading Level",
    "3.1.6": "Pronunciation",
    "3.2.1": "On Focus",
    "3.2.2": "On Input",
    "3.2.3": "Consistent Navigation",
    "3.2.4": "Consistent Identification",
    "3.2.5": "Change on Request",
    "3.3.1": "Error Identification",
    "3.3.2": "Labels or Instructions",
    "3.3.3": "Error Suggestion",
    "3.3.4": "Error Prevention (Legal, Financial, Data)",
    "3.3.5": "Help",
    "3.3.6": "Error Prevention (All)",
    "4.1.1": "Parsing",
    "4.1.2": "Name, Role, Value",
    "4.1.3": "Status Messages",
  };

  const wcagTechniques = {
    G1: "Adding a link at the top of each page that goes directly to the main content area",
    G4: "Allowing the content to be paused and restarted from where it was paused",
    G5: "Allowing users to complete an activity without any time limit",
    G8: "Providing a movie with extended audio descriptions",
    G9: "Creating captions for live synchronized media",
    G10: "Creating components using a technology that supports the accessibility API features of the platforms on which the user agents will be run to expose the names and roles, allow user-settable properties to be directly set, and provide notification of changes",
    G11: "Creating content that blinks for less than 5 seconds",
    G13: "Describing what will happen before a change to a form control that causes a change of context to occur is made",
    G14: "Ensuring that information conveyed by color differences is also available in text",
    G15: "Using a tool to ensure that content does not violate the general flash threshold or red flash threshold",
    G17: "Ensuring that a contrast ratio of at least 7",
    G18: "Ensuring that a contrast ratio of at least 4.5",
    G19: "Ensuring that no component of the content flashes more than three times in any 1-second period",
    G21: "Ensuring that users are not trapped in content",
    G53: "Identifying the purpose of a link using link text combined with the text of the enclosing sentence",
    G54: "Including a sign language interpreter in the video stream",
    G55: "Linking to definitions",
    G56: "Mixing audio files so that non-speech sounds are at least 20 decibels lower than the speech audio content",
    G57: "Ordering the content in a meaningful sequence",
    G58: "Placing a link to the alternative for time-based media immediately next to the non-text content",
    G59: "Placing the interactive elements in an order that follows sequences and relationships within the content",
    G60: "Playing a sound that turns off automatically within three seconds",
    G61: "Presenting repeated components in the same relative order each time they appear",
    G62: "Providing a glossary",
    G63: "Providing a site map",
    G64: "Providing a Table of Contents",
    G65: "Providing a breadcrumb trail",
    G68: "Providing a short text alternative that describes the purpose of live audio-only and live video-only content",
    G69: "Providing an alternative for time-based media for audio-only content",
    G70: "Providing a function to search an online dictionary",
    G71: "Providing a help link on every Web page",
    G73: "Providing a long description in another location with a link to it that is immediately adjacent to the non-text content",
    G74: "Providing a long description in text near the non-text content, with a reference to the location of the long description in the short description",
    G75: "Providing a mechanism to postpone any updating of content",
    G76: "Providing a mechanism to request an update of the content instead of updating automatically",
    G78: "Providing a second, user-selectable, audio track that includes audio descriptions",
    G79: "Providing a spoken version of the text",
    G80: "Providing a submit button to initiate a change of context",
    G81: "Providing a synchronized video of the sign language interpreter that can be displayed in a different viewport or overlaid on the image by the player",
    G82: "Providing a text alternative that identifies the purpose of the non-text content",
    G83: "Providing text descriptions to identify required fields that were not completed",
    G84: "Providing a text description when the user provides information that is not in the list of allowed values",
    G85: "Providing a text description when user input falls outside the required format or values",
    G86: "Providing a text summary that can be understood by people with lower secondary education level reading ability",
    G87: "Providing closed captions",
    G88: "Providing descriptive titles for Web pages",
    G89: "Providing expected data format and example",
    G90: "Providing keyboard-triggered event handlers",
    G91: "Providing link text that describes the purpose of a link",
    G92: "Providing long description for non-text content that serves the same purpose and presents the same information",
    G93: "Providing open (always visible) captions",
    G94: "Providing short text alternative for non-text content that serves the same purpose and presents the same information as the non-text content",
    G95: "Providing short text alternatives that provide a brief description of the non-text content",
    G96: "Providing textual identification of items that otherwise rely only on sensory information to be understood",
    G97: "Providing the first use of an abbreviation immediately before or after the expanded form",
    G98: "Providing the ability for the user to review and correct answers before submitting",
    G99: "Providing the ability to recover deleted information",
    G100: "Providing a short text alternative which is the accepted name or a descriptive name of the non-text content",
    G101: "Providing the definition of a word or phrase used in an unusual or restricted way",
    G102: "Providing the expansion or explanation of an abbreviation",
    G103: "Providing visual illustrations, pictures, and symbols to help explain ideas, events, and processes",
    G105: "Saving data so that it can be used after a user re-authenticates",
    G107: "Using 'activate' rather than 'focus' as a trigger for changes of context",
    G108: "Using markup features to expose the name and role, allow user-settable properties to be directly set, and provide notification of changes",
    G110: "Using an instant client-side redirect",
    G111: "Using color and pattern",
    G112: "Using inline definitions",
    G115: "Using semantic elements to mark up structure",
    G117: "Using text to convey information that is conveyed by variations in presentation of text",
    G120: "Providing the pronunciation immediately following the word",
    G121: "Linking to pronunciations",
    G123: "Adding a link at the beginning of a block of repeated content to go to the end of the block",
    G124: "Adding links at the top of the page to each area of the content",
    G125: "Providing links to navigate to related Web pages",
    G126: "Providing a list of links to all other Web pages",
    G127: "Identifying a Web page's relationship to a larger collection of Web pages",
    G128: "Indicating current location within navigation bars",
    G130: "Providing descriptive headings",
    G131: "Providing descriptive labels",
    G133: "Providing a checkbox on the first page of a multipart form that allows users to ask for longer session time limit or no session time limit",
    G134: "Validating Web pages",
    G135: "Using the accessibility API features of a technology to expose names and roles, to allow user-settable properties to be directly set, and to provide notification of changes",
    G136: "Providing a link at the beginning of a nonconforming Web page that points to a conforming alternate version",
    G138: "Using semantic markup whenever color cues are used",
    G139: "Creating a mechanism that allows users to jump to errors",
    G140: "Separating information and structure from presentation to enable different presentations",
    G141: "Organizing a page using headings",
    G142: "Using a technology that has commonly-available user agents that support zoom",
    G143: "Providing a text alternative that describes the purpose of the CAPTCHA",
    G144: "Ensuring that the Web Page contains another CAPTCHA serving the same purpose using a different modality",
    G145: "Ensuring that a contrast ratio of at least 3",
    G146: "Using liquid layout",
    G148: "Not specifying background color, not specifying text color, and not using technology features that change those defaults",
    G149: "Using user interface components that are highlighted by the user agent when they receive focus",
    G150: "Providing text based alternatives for live audio-only content",
    G151: "Providing a link to a text transcript of a prepared statement or script if the script is followed",
    G152: "Setting animated gif images to stop blinking after n cycles (within 5 seconds)",
    G153: "Making the text easier to read",
    G155: "Providing a checkbox in addition to a submit button",
    G156: "Using a technology that has commonly-available user agents that can change the foreground and background of blocks of text",
    G157: "Incorporating a live audio captioning service into a Web page",
    G158: "Providing an alternative for time-based media for audio-only content",
    G159: "Providing an alternative for time-based media for video-only content",
    G160: "Providing sign language versions of information, ideas, and processes that must be understood in order to use the content",
    G161: "Providing a search function to help users find content",
    G162: "Positioning labels to maximize predictability of relationships",
    G163: "Using standard diacritical marks that can be turned off",
    G164: "Providing a stated time within which an online request (or transaction) may be amended or canceled by the user after making the request",
    G165: "Using the default focus indicator for the platform so that high visibility default focus indicators will carry over",
    G166: "Providing audio that describes the important video content and describing it as such",
    G167: "Using an adjacent button to label the purpose of a field",
    G168: "Requesting confirmation to continue with selected action",
    G169: "Aligning text on only one side",
    G170: "Providing a control near the beginning of the Web page that turns off sounds that play automatically",
    G171: "Playing sounds only on user request",
    G172: "Providing a mechanism to remove full justification of text",
    G173: "Providing a version of a movie with audio descriptions",
    G174: "Providing a control with a sufficient contrast ratio that allows users to switch to a presentation that uses sufficient contrast",
    G175: "Providing a multi color selection tool on the page for foreground and background colors",
    G176: "Keeping the flashing area small enough",
    G177: "Providing suggested correction text",
    G178: "Providing controls on the Web page that allow users to incrementally change the size of all text on the page up to 200 percent",
    G179: "Ensuring that there is no loss of content or functionality when the text resizes and text containers do not change their width",
    G180: "Providing the user with a means to set the time limit to 10 times the default time limit",
    G181: "Encoding user data as hidden or encrypted data in a re-authorization page",
    G182: "Ensuring that additional visual cues are available when text color differences are used to convey information",
    G183: "Using a contrast ratio of 3",
    G184: "Providing text instructions at the beginning of a form or set of fields that describes the necessary input",
    G185: "Linking to all of the pages on the site from the home page",
    G186: "Using a control in the Web page that stops moving, blinking, or auto-updating content",
    G187: "Using a technology to include blinking content that can be turned off via the user agent",
    G188: "Providing a button on the page to increase line spaces and paragraph spaces",
    G189: "Providing a control near the beginning of the Web page that changes the link text",
    G190: "Providing a link adjacent to or associated with a non-conforming object that links to a conforming alternate version",
    G191: "Providing a link, button, or other mechanism that reloads the page without any blinking content",
    G192: "Fully conforming to specifications",
    G193: "Providing help by an assistant in the Web page",
    G194: "Providing spell checking and suggestions for text input",
    G195: "Using an author-supplied, highly visible focus indicator",
    G196: "Using a text alternative on one item within a group of images that describes all items in the group",
    G197: "Using labels, names, and text alternatives consistently for content that has the same functionality",
    G198: "Providing a way for the user to turn the time limit off",
    G199: "Providing success feedback when data is submitted successfully",
    G200: "Opening new windows and tabs from a link only when necessary",
    G201: "Giving users advanced warning when opening a new window",
    G202: "Ensuring keyboard control for all functionality",
    G203: "Using a static text alternative to describe a talking head video",
    G204: "Not interfering with the user agent's reflow of text as the viewing window is narrowed",
    G205: "Including a text cue for colored form control labels",
    G206: "Providing options within the content to switch to a layout that does not require the user to scroll horizontally to read a line of text",
    H2: "Combining adjacent image and text links for the same resource",
    H4: "Creating a logical tab order through links, form controls, and objects",
    H24: " Providing text alternatives for the area elements of image maps ",
    H25: "Providing a title using the title element",
    H28: "Providing definitions for abbreviations by using the abbr element",
    H30: "Providing link text that describes the purpose of a link for anchor elements",
    H32: "Providing submit buttons",
    H33: "Supplementing link text with the title attribute",
    H34: "Using a Unicode right-to-left mark (RLM) or left-to-right mark (LRM) to mix text direction inline",
    H35: " Providing text alternatives on applet elements ",
    H36: "Using alt attributes on images used as submit buttons",
    H37: "Using alt attributes on img elements",
    H39: "Using caption elements to associate data table captions with data tables",
    H40: "Using description lists",
    H42: "Using h1-h6 to identify headings",
    H43: "Using id and headers attributes to associate data cells with header cells in data tables",
    H44: "Using label elements to associate text labels with form controls",
    H45: "Using longdesc",
    H46: "Using noembed with embed",
    H48: "Using ol, ul and dl for lists or groups of links",
    H49: "Using semantic markup to mark emphasized or special text",
    H51: "Using table markup to present tabular information",
    H53: "Using the body of the object element",
    H54: "Using the dfn element to identify the defining instance of a word",
    H56: "Using the dir attribute on an inline element to resolve problems with nested directional runs",
    H57: " Using language attributes on the html element ",
    H58: "Using language attributes to identify changes in the human language ",
    H59: "Using the link element and navigation tools",
    H60: "Using the link element to link to a glossary",
    H62: "Using the ruby element",
    H63: "Using the scope attribute to associate header cells and data cells in data tables",
    H64: "Using the title attribute of the frame and iframe elements",
    H65: "Using the title attribute to identify form controls when the label element cannot be used",
    H67: "Using null alt text and no title attribute on img elements for images that AT should ignore",
    H69: "Providing heading elements at the beginning of each section of content",
    H70: "Using frame elements to group blocks of repeated material",
    H71: " Providing a description for groups of form controls using fieldset and legend elements ",
    H73: "Using the summary attribute of the table element to give an overview of data tables",
    H74: "Ensuring that opening and closing tags are used according to specification",
    H75: "Ensuring that Web pages are well-formed",
    H76: "Using meta refresh to create an instant client-side redirect",
    H77: "Identifying the purpose of a link using link text combined with its enclosing list item",
    H78: "Identifying the purpose of a link using link text combined with its enclosingparagraph",
    H79: "Identifying the purpose of a link in a data table using the link text combined with its enclosing table cell and associated table header cells",
    H80: "Identifying the purpose of a link using link text combined with the preceding heading element",
    H81: "Identifying the purpose of a link in a nested list using link text combined with the parent list item under which the list is nested",
    H83: "Using the target attribute to open a new window on user request and indicating this in link text",
    H84: "Using a button with a select element to perform an action",
    H85: "Using OPTGROUP to group OPTION elements inside a SELECT",
    H86: "Providing text alternatives for ASCII art, emoticons, and leetspeak",
    H88: "Using HTML according to spec",
    H89: "Using the title attribute to provide context-sensitive help",
    H90: "Indicating required form controls using label or legend",
    H91: "Using HTML form controls and links",
    H93: "Ensuring that id attributes are unique on a Web page",
    H94: "Ensuring that elements do not contain duplicate attributes",
    H95: "Using the track element to provide captions",
    H96: "Using the track element to provide audio descriptions",
    H97: "Grouping related links using the nav element",
    C6: "Positioning content based on structural markup",
    C7: "Using CSS to hide a portion of the link text ",
    C8: "Using CSS letter-spacing to control spacing within a word",
    C9: "Using CSS to include decorative images",
    C12: "Using percent for font sizes",
    C13: "Using named font sizes",
    C14: "Using em units for font sizes",
    C15: "Using CSS to change the presentation of a user interface component when it receives focus",
    C17: "Scaling form elements which contain text",
    C18: "Using CSS margin and padding rules instead of spacer images for layout design",
    C19: "Specifying alignment either to the left OR right in CSS",
    C20: "Using relative measurements to set column widths so that lines can average 80 characters or less when the browser is resized",
    C21: "Specifying line spacing in CSS",
    C22: "Using CSS to control visual presentation of text",
    C23: "Specifying text and background colors of secondary content such as banners, features and navigation in CSS while not specifying text and background colors of the main content",
    C24: "Using percentage values in CSS for container sizes",
    C25: "Specifying borders and layout in CSS to delineate areas of a Web page while not specifying text and text-background colors",
    C27: "Making the DOM order match the visual order",
    C28: "Specifying the size of text containers using em units",
    C29: "Using a style switcher to provide a conforming alternate version",
    C30: "Using CSS to replace text with images of text and providing user interface controls to switch",
    SCR1: "Allowing the user to extend the default time limit",
    SCR2: "Using redundant keyboard and mouse event handlers",
    SCR14: "Using scripts to make nonessential alerts optional",
    SCR16:
      "Providing a script that warns the user a time limit is about to expire",
    SCR18: "Providing client-side validation and alert",
    SCR19:
      "Using an onchange event on a select element without causing a change of context",
    SCR20: "Using both keyboard and other device-specific functions",
    SCR21:
      "Using functions of the Document Object Model (DOM) to add content to a page",
    SCR22:
      "Using scripts to control blinking and stop it in five seconds or less",
    SCR24: "Using progressive enhancement to open new windows on user request",
    SCR26:
      "Inserting dynamic content into the Document Object Model immediately following its trigger element",
    SCR27: "Reordering page sections using the Document Object Model",
    SCR28:
      "Using an expandable and collapsible menu to bypass block of content",
    SCR29: "Adding keyboard-accessible actions to static HTML elements",
    SCR30: "Using scripts to change the link text",
    SCR31:
      "Using script to change the background color or border of the element with focus",
    SCR32: "Providing client-side validation and adding error text via the DOM",
    SCR33:
      "Using script to scroll content, and providing a mechanism to pause it",
    SCR34: "Calculating size and position in a way that scales with text size",
    SCR35:
      "Making actions keyboard accessible by using the onclick event of anchors and buttons",
    SCR36:
      "Providing a mechanism to allow users to display moving, scrolling, or auto-updating text in a static window or area",
    SCR37: "Creating Custom Dialogs in a Device Independent Way",
    SCR38:
      "Creating a conforming alternate version for a web page designed with progressive enhancement",
    SVR1: "Implementing automatic redirects on the server side instead of on theclient side",
    SVR2: "Using .htaccess to ensure that the only way to access non-conforming content is from conforming content",
    SVR3: "Using HTTP referer to ensure that the only way to access non-conforming content is from conforming content",
    SVR4: "Allowing users to provide preferences for the display of conforming alternate versions",
    SVR5: "Specifying the default language in the HTTP header",
    SM1: "Adding extended audio description in SMIL 1.0",
    SM2: "Adding extended audio description in SMIL 2.0",
    SM6: "Providing audio description in SMIL 1.0",
    SM7: "Providing audio description in SMIL 2.0",
    SM11: "Providing captions through synchronized text streams in SMIL 1.0",
    SM12: "Providing captions through synchronized text streams in SMIL 2.0",
    SM13: "Providing sign language interpretation through synchronized video streams in SMIL 1.0",
    SM14: "Providing sign language interpretation through synchronized video streams in SMIL 2.0",
    T1: "Using standard text formatting conventions for paragraphs",
    T2: "Using standard text formatting conventions for lists",
    T3: "Using standard text formatting conventions for headings",
    ARIA1:
      "Using the aria-describedby property to provide a descriptive label for user interface controls",
    ARIA2: "Identifying a required field with the aria-required property",
    ARIA4:
      "Using a WAI-ARIA role to expose the role of a user interface component",
    ARIA5:
      "Using WAI-ARIA state and property attributes to expose the state of a user interface component",
    ARIA6: "Using aria-label to provide labels for objects",
    ARIA7: "Using aria-labelledby for link purpose",
    ARIA8: "Using aria-label for link purpose",
    ARIA9:
      "Using aria-labelledby to concatenate a label from several text nodes",
    ARIA10:
      "Using aria-labelledby to provide a text alternative for non-text content",
    ARIA11: "Using ARIA landmarks to identify regions of a page",
    ARIA12: "Using role=heading to identify headings",
    ARIA13: "Using aria-labelledby to name regions and landmarks",
    ARIA14:
      "Using aria-label to provide an invisible label where a visible label cannot be used",
    ARIA15: "Using aria-describedby to provide descriptions of images",
    ARIA16:
      "Using aria-labelledby to provide a name for user interface controls",
    ARIA17: "Using grouping roles to identify related form controls",
    ARIA18: "Using aria-alertdialog to Identify Errors",
    ARIA19: "Using ARIA role=alert or Live Regions to Identify Errors",
    ARIA20: "Using the region role to identify a region of the page",
    ARIA21: "Using Aria-Invalid to Indicate An Error Field",
    FLASH1: "Setting the name property for a non-text object",
    FLASH2: "Setting the description property for a non-text object in Flash",
    FLASH3: "Marking objects in Flash so that they can be ignored by AT",
    FLASH4: "Providing submit buttons in Flash",
    FLASH5: "Combining adjacent image and text buttons for the same resource",
    FLASH6: "Creating accessible hotspots using invisible buttons",
    FLASH7: "Using scripting to change control labels",
    FLASH8: "Adding a group name to the accessible name of a form control",
    FLASH9: "Applying captions to prerecorded synchronized media",
    FLASH10: "Indicating required form controls in Flash",
    FLASH11: "Providing a longer text description of an object",
    FLASH12:
      "Providing client-side validation and adding error text via the accessible description",
    FLASH13:
      "Using HTML language attributes to specify language in Flash content",
    FLASH14: "Using redundant keyboard and mouse event handlers in Flash",
    FLASH15:
      "Using the tabIndex property to specify a logical reading order and a logical tab order in Flash",
    FLASH16:
      "Making actions keyboard accessible by using the click event on standard components",
    FLASH17:
      "Providing keyboard access to a Flash object and avoiding a keyboard trap",
    FLASH18:
      "Providing a control to turn off sounds that play automatically in Flash",
    FLASH19:
      "Providing a script that warns the user a time limit is about to expire and provides a way to extend it",
    FLASH20:
      "Reskinning Flash components to provide highly visible focus indication",
    FLASH21:
      "Using the DataGrid component to associate column headers with cells",
    FLASH22: "Adding keyboard-accessible actions to static elements",
    FLASH23: "Adding summary information to a DataGrid",
    FLASH24: "Allowing the user to extend the default time limit",
    FLASH25: "Labeling a form control by setting its accessible name",
    FLASH26: "Applying audio descriptions to Flash video",
    FLASH27: "Providing button labels that describe the purpose of a button",
    FLASH28:
      "Providing text alternatives for ASCII art, emoticons, and leetspeak in Flash",
    FLASH29: "Setting the label property for form components",
    FLASH30: "Specifying accessible names for image buttons",
    FLASH31: "Specifying caption text for a DataGrid",
    FLASH32: "Using auto labeling to associate text labels with form controls",
    FLASH33: "Using relative values for Flash object dimensions",
    FLASH34:
      "Turning off sounds that play automatically when an assistive technology is detected",
    FLASH35:
      "Using script to scroll Flash content, and providing a mechanism to pause it",
    FLASH36:
      "Using scripts to control blinking and stop it in five seconds or less",
    SL1: "Accessing Alternate Audio Tracks in Silverlight Media",
    SL2: "Changing The Visual Focus Indicator in Silverlight",
    SL3: "Controlling Silverlight MediaElement Audio Volume",
    SL4: "Declaring Discrete Silverlight Objects to Specify Language Parts in the HTML DOM",
    SL5: "Defining a Focusable Image Class for Silverlight",
    SL6: "Defining a UI Automation Peer for a Custom Silverlight Control",
    SL7: "Designing a Focused Visual State for Custom Silverlight Controls",
    SL8: "Displaying HelpText in Silverlight User Interfaces",
    SL9: "Handling Key Events to Enable Keyboard Functionality in Silverlight",
    SL10: "Implementing a Submit-Form Pattern in Silverlight",
    SL11: "Pausing or Stopping A Decorative Silverlight Animation",
    SL12: "Pausing, Stopping, or Playing Media in Silverlight MediaElements",
    SL13: "Providing A Style Switcher To Switch To High Contrast",
    SL14: "Providing Custom Control Key Handling for Keyboard Functionality in Silverlight",
    SL15: "Providing Keyboard Shortcuts that Work Across the Entire Silverlight Application",
    SL16: "Providing Script-Embedded Text Captions for MediaElement Content",
    SL17: "Providing Static Alternative Content for Silverlight Media Playing in a MediaElement",
    SL18: "Providing Text Equivalent for Nontext Silverlight Controls With AutomationProperties.Name",
    SL19: "Providing User Instructions With AutomationProperties.HelpText in Silverlight",
    SL20: "Relying on Silverlight AutomationPeer Behavior to Set AutomationProperties.Name",
    SL21: "Replacing A Silverlight Timed Animation With a Nonanimated Element",
    SL22: "Supporting Browser Zoom in Silverlight",
    SL23: "Using A Style Switcher to Increase Font Size of Silverlight Text Elements",
    SL24: "Using AutoPlay to Keep Silverlight Media from Playing Automatically",
    SL25: "Using Controls and Programmatic Focus to Bypass Blocks of Contentin Silverlight",
    SL26: "Using LabeledBy to Associate Labels and Targets in Silverlight",
    SL27: "Using Language/Culture Properties as Exposed by Silverlight Applications and Assistive Technologies",
    SL28: "Using Separate Text-Format Text Captions for MediaElement Content",
    SL29: "Using Silverlight 'List' Controls to Define Blocks thatcan be Bypassed",
    SL30: "Using Silverlight Control Compositing and AutomationProperties.Name",
    SL31: "Using Silverlight Font Properties to Control Text Presentation",
    SL32: "Using Silverlight Text Elements for Appropriate Accessibility Role",
    SL33: "Using Well-Formed XAML to Define a Silverlight User Interface",
    SL34: "Using the Silverlight Default Tab Sequence and Altering Tab SequencesWith Properties",
    SL35: "Using the Validation and ValidationSummary APIs to Implement Client Side Forms Validation in Silverlight",
    PDF1: "Applying text alternatives to images with the Alt entry in PDF documents",
    PDF2: "Creating bookmarks in PDF documents",
    PDF3: "Ensuring correct tab and reading order in PDF documents",
    PDF4: "Hiding decorative images with the Artifact tag in PDF documents",
    PDF5: "Indicating required form controls in PDF forms",
    PDF6: "Using table elements for table markup in PDF Documents",
    PDF7: "Performing OCR on a scanned PDF document to provide actual text",
    PDF8: "Providing definitions for abbreviations via an E entry for a structure element",
    PDF9: "Providing headings by marking content with heading tags in PDF documents",
    PDF10: "Providing labels for interactive form controls in PDF documents",
    PDF11:
      "Providing links and link text using the Link annotation and the /Link structure element in PDF documents",
    PDF12:
      "Providing name, role, value information for form fields in PDF documents",
    PDF13:
      "Providing replacement text using the /Alt entry for links in PDF documents",
    PDF14: "Providing running headers and footers in PDF documents",
    PDF15: "Providing submit buttons with the submit-form action in PDF forms",
    PDF16:
      "Setting the default language using the /Lang entry in the document catalog of a PDF document",
    PDF17: "Specifying consistent page numbering for PDF documents",
    PDF18:
      "Specifying the document title using the Title entry in the document information dictionary of a PDF document",
    PDF19:
      "Specifying the language for a passage or phrase with the Lang entry in PDF documents",
    PDF20: "Using Adobe Acrobat Pro's Table Editor to repair mistagged tables",
    PDF21: "Using List tags for lists in PDF documents",
    PDF22:
      "Indicating when user input falls outside the required format or values in PDF forms",
    PDF23: "Providing interactive form controls in PDF documents",
    F1: "Failure of Success Criterion 1.3.2 due to changing the meaning of content bypositioning information with CSS",
    F2: "Failure of Success Criterion 1.3.1 due to using changes in text presentation to convey information without using the appropriate markup or text",
    F3: "Failure of Success Criterion 1.1.1 due to using CSS to include images that conveyimportant information",
    F4: "Failure of Success Criterion 2.2.2 due to using text-decoration",
    F7: "Failure of Success Criterion 2.2.2 due to an object or applet, such as Java or Flash,that has blinking content without a mechanism to pause the content that blinksfor more than five seconds",
    F8: "Failure of Success Criterion 1.2.2 due to captions omitting some dialogue or importantsound effects",
    F9: "Failure of Success Criterion 3.2.5 due to changing the context when the user removes focus from a form element",
    F10: "Failure of Success Criterion 2.1.2 and Conformance Requirement 5 due to combining multiple content formats in a way that traps users inside one format type",
    F12: "Failure of Success Criterion 2.2.5 due to having a session time limit without a mechanism for saving user's input and re-establishing that information upon re-authentication",
    F13: "Failure of Success Criterion 1.1.1 and 1.4.1 due to having a text alternative that does not include information that is conveyed by color differences in the image",
    F14: "Failure of Success Criterion 1.3.3 due to identifying content only by its shape or location",
    F15: "Failure of Success Criterion 4.1.2 due to implementing custom controls that do not use an accessibility API for the technology, or do so incompletely",
    F16: "Failure of Success Criterion 2.2.2 due to including scrolling content where movement is not essential to the activity without also including a mechanism to pause and restart the content",
    F19: "Failure of Conformance Requirement 1 due to not providing a method for the user to find the alternative conforming version of a non-conforming Web page",
    F20: "Failure of Success Criterion 1.1.1 and 4.1.2 due to not updating text alternatives whenchanges to non-text content occur",
    F22: "Failure of Success Criterion 3.2.5 due to opening windows that are not requested by theuser",
    F23: "Failure of  1.4.2 due to playing a sound longer than 3 seconds wherethere is no mechanism to turn it off",
    F24: "Failure of Success Criterion 1.4.3, 1.4.6 and 1.4.8 due to specifying foreground colors without specifying background colors or vice versa",
    F25: "Failure of Success Criterion 2.4.2 due to the title of a Web page not identifying the contents",
    F26: "Failure of Success Criterion 1.3.3 due to using a graphical symbol alone to convey information",
    F30: "Failure of Success Criterion 1.1.1 and 1.2.1 due to using text alternatives that are notalternatives (e.g., filenames or placeholder text)",
    F31: "Failure of Success Criterion 3.2.4 due to using two different labels for the same function on different Web pages within a set of Web pages ",
    F32: "Failure of Success Criterion 1.3.2 due to using white space characters to controlspacing within a word",
    F33: "Failure of Success Criterion 1.3.1 and 1.3.2 due to using white space characters to create multiple columns in plain text content",
    F34: "Failure of Success Criterion 1.3.1 and 1.3.2 due to using white space characters to format tables in plain text content",
    F36: "Failure of Success Criterion 3.2.2 due to automatically submitting a form and presenting new content without prior warning when the last field in the form isgiven a value",
    F37: "Failure of Success Criterion 3.2.2 due to launching a new window without prior warning when the selection of a radio button, check box or select list is changed",
    F38: "Failure of Success Criterion 1.1.1 due to not marking up decorative images in HTML in a way that allows assistive technology to ignore them",
    F39: "Failure of Success Criterion 1.1.1 due to providing a text alternative that is not null (e.g., alt='spacer' or alt='image') for images that should be ignored by assistive technology",
    F40: "Failure of Success Criterion 2.2.1 and 2.2.4 due to using meta redirect with a time limit",
    F41: "Failure of Success Criterion 2.2.1, 2.2.4, and 3.2.5 due to using meta refresh to reload the page",
    F42: "Failure of Success Criteria 1.3.1, 2.1.1, 2.1.3, or 4.1.2 when emulating links",
    F43: "Failure of Success Criterion 1.3.1 due to using structural markup in a way that doesnot represent relationships in the content",
    F44: "Failure of Success Criterion 2.4.3 due to using tabindex to create a tab order that does not preserve meaning and operability",
    F46: "Failure of Success Criterion 1.3.1 due to using th elements,caption elements, or non-empty summary attributes i layout tables",
    F47: "Failure of Success Criterion 2.2.2 due to using the blink element",
    F48: "Failure of Success Criterion 1.3.1 due to using the pre element to markuptabular information",
    F49: "Failure of Success Criterion 1.3.2 due to using an HTML layout table that does not make sense when linearized  ",
    F50: "Failure of Success Criterion 2.2.2 due to a script that causes a blink effect without amechanism to stop the blinking at 5 seconds or less",
    F52: "Failure of Success Criterion 3.2.1 and 3.2.5 due to opening a new window as soon as a new page is loaded",
    F54: "Failure of Success Criterion 2.1.1 due to using only pointing-device-specific eventhandlers (including gesture) for a function",
    F55: "Failure of Success Criteria 2.1.1, 2.4.7, and 3.2.1 due to using script to remove focus when focus is received",
    F58: "Failure of Success Criterion 2.2.1 due to using server-side techniques to automaticallyredirect pages after a time-out",
    F59: "Failure of Success Criterion 4.1.2 due to using script to make div or span a user interface control in HTML without providing a role for the control",
    F60: "Failure of Success Criterion 3.2.5 due to launching a new window when a user enterstext into an input field",
    F61: "Failure of Success Criterion 3.2.5 due to complete change of main content through anautomatic update that the user cannot disable from within the content",
    F63: "Failure of Success Criterion 2.4.4 due to providing link context only in content that is not related to the link",
    F65: "Failure of Success Criterion 1.1.1 due to omitting the alt attribute or text alternative on img elements, area elements, and input elements of type 'image'",
    F66: "Failure of Success Criterion 3.2.3 due to presenting navigation links in a different relative order on different pages",
    F67: "Failure of Success Criterion 1.1.1 and 1.2.1 due to providing long descriptions for non-text content that does not serve the same purpose or does not present the same information",
    F68: "Failure of Success Criterion 4.1.2 due to a user interface control not having a programmatically determined name  ",
    F69: "Failure of Success Criterion 1.4.4 when resizing visually rendered text up to 200 percent causes the text, image or controls to be clipped, truncated or obscured",
    F70: "Failure of Success Criterion 4.1.1 due to incorrect use of start and end tags or attribute markup",
    F71: "Failure of Success Criterion 1.1.1 due to using text look-alikes to represent text without providing a text alternative",
    F72: "Failure of Success Criterion 1.1.1 due to using ASCII art without providing a text alternative",
    F73: "Failure of Success Criterion 1.4.1 due to creating links that are not visually evident without color vision",
    F74: "Failure of  Success Criterion 1.2.2 and 1.2.8 due to not labeling a synchronized media alternative to text as an alternative",
    F75: "Failure of Success Criterion 1.2.2 by providing synchronized media without captions when the synchronized media presents more information than is presented on the page",
    F77: "Failure of Success Criterion 4.1.1 due to duplicate values of type ID",
    F78: "Failure of Success Criterion 2.4.7 due to styling element outlines and borders in a way that removes or renders non-visible the visual focus indicator",
    F79: "Failure of Success Criterion 4.1.2 due to the focus state of a user interface component not being programmatically determinable or no notification of change of focus state available",
    F80: "Failure of Success Criterion 1.4.4 when text-based form controls do not resize when visually rendered text is resized up to 200%",
    F81: "Failure of Success Criterion 1.4.1 due to identifying required or error fields using color differences only",
    F82: "Failure of Success Criterion 3.3.2 by visually formatting a set of phone number fields but not including a text label",
    F83: "Failure of Success Criterion 1.4.3 and 1.4.6 due to using background images that do not provide sufficient contrast with foreground text (or images of text)",
    F84: "Failure of Success Criterion 2.4.9 due to using a non-specific link such as 'click here' or 'more' without a mechanism to change the link text to specific text.",
    F85: "Failure of Success Criterion 2.4.3 due to using dialogs or menus that are not adjacent to their trigger control in the sequential navigation order",
    F86: "Failure of Success Criterion 4.1.2 due to not providing names for each part of a multi-part form field, such as a US telephone number",
    F87: "Failure of Success Criterion 1.3.1 due to inserting non-decorative content by using ",
    F88: "Failure of Success Criterion 1.4.8 due to using text that is justified (aligned to both the left and the right margins)",
    F89: "Failure of Success Criteria 2.4.4, 2.4.9 and 4.1.2 due to not providing an accessible name for an image which is the only content in a link",
    F90: "Failure of Success Criterion 1.3.1 for incorrectly associating table headers and content via the headers and id attributes",
    F91: "Failure of Success Criterion 1.3.1 for not correctly marking up table headers",
    F92: "Failure of Success Criterion 1.3.1 due to the use of role presentation on content which conveys semantic information",
    F93: "Failure of Success Criterion 1.4.2 for absence of a way to pause or stop an HTML5 media element that autoplays",
  };

  const parts = code.split('.');
  const standard = parts[0];
  const principle = parts[1];
  const guideline = parts[2];
  const successCriterion = parts[3];
  let techniques = parts[4] || '';
  let context = parts[5] || '';

  // Handle multiple techniques
  const techniqueList = techniques.split(',').filter(t => t);

  const explanations = {};

  if (parts[1].startsWith("Principle")) {
    const principles = {
      Principle1: "Perceivable",
      Principle2: "Operable",
      Principle3: "Understandable",
      Principle4: "Robust",
    };
    explanations[parts[1]] = principles[parts[1]];
  }

  if (parts[2].startsWith("Guideline")) {
    const guidelineName = wcagGuidelines[parts[2]] || "Unknown Guideline";
    explanations[parts[2]] = guidelineName;
  }

  if (parts[3]) {
    const formattedCriterion = parts[3].replace(/_/g, ".");
    const successCriterionName =
      wcagSuccessCriteria[formattedCriterion] || "Unknown Success Criterion";
    explanations[formattedCriterion] = successCriterionName;
  }

  if (parts[4]) {
    const techniqueCode = parts[4].split(".")[0];
    const techniqueDescription =
      wcagTechniques[techniqueCode] || "Unknown Technique";
    explanations[parts[4]] = techniqueDescription;
  }

  // Get the full guideline name
  const guidelineName = wcagGuidelines[guideline] || 'Unknown Guideline';

  // Get the success criterion description
  const scNumber = successCriterion.replace(/_/g, '.');
  const scDescription = wcagSuccessCriteria[scNumber] || 'Unknown Success Criterion';

  // Get technique descriptions
  const techniqueDescriptions = techniqueList.map(t => {
    const techniqueCode = t.replace(/^[HG]/, '');
    return wcagTechniques[t] || wcagTechniques[`G${techniqueCode}`] || wcagTechniques[`H${techniqueCode}`] || 'Unknown Technique';
  });

  // Build the explanation object
  const explanation = {
    standard,
    principle: principle.replace('Principle', 'Principle '),
    guideline: `${guidelineName} (${guideline.replace('Guideline', 'Guideline ')})`,
    successCriterion: `${scDescription} (${scNumber})`,
    techniques: techniqueDescriptions,
    context: context ? `Context: ${context}` : ''
  };

  return explanation;
}

// String processing endpoint with path parameter
app.get("/decode/:input", (req, res) => {
  try {
    const { input } = req.params;

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        error: "Input must be a non-empty string",
      });
    }

    // Process the string (example: reverse it)
    const result = explainWCAGCode(input);

    res.json({
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error processing string",
      details: error.message,
    });
  }
});

app.get("/proxy", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send("URL parameter is required");
    }

    const response = await axios.get(url);
    let html = response.data;

    // Inject marker script
    const markerScript = `
      <script id="marker-script">
        console.log('Marker script injected');
        function addMarker(selector) {
          console.log('Attempting to add marker for selector:', selector);
          const element = document.querySelector(selector);
          if (element) {
            console.log('Element found:', element);
            const existingMarker = element.querySelector('.element-marker');
            if (existingMarker) existingMarker.remove();
            const marker = document.createElement('div');
            marker.className = 'element-marker';
            element.style.position = 'relative';
            element.appendChild(marker);
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            console.log('Element not found for selector:', selector);
          }
        }
      </script>
    `;
    html = html.replace(/<head>/, `<head>${markerScript}`);
    res.send(html);
  } catch (error) {
    res.status(500).send('Error fetching website');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
