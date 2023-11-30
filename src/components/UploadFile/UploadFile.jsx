import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { PdfLoader, PdfHighlighter } from "react-pdf-annotation";

const PdfViewer = ({ pdfUrl }) => {
  const [highlights, setHighlights] = useState([]);

  const onHighlight = (highlight) => {
    setHighlights([...highlights, highlight]);
  };

  return (
    <div>
      <PdfLoader url={pdfUrl}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            onScrollChange={null}
            scrollRef={null}
            onSelectionFinished={onHighlight}
            highlights={highlights}
            enableAreaSelection={(event) => event.altKey}
          >
            <Document file={pdfDocument} onLoadSuccess={null}>
              <Page pageNumber={1} />
            </Document>
          </PdfHighlighter>
        )}
      </PdfLoader>
    </div>
  );
};

export default PdfViewer;
