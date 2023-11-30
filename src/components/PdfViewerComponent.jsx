import { useEffect, useRef, useState } from "react";

export default function PdfViewerComponent(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit;
    let instance;
    console.log("blob=", container, props.document);
    // Unload the previous PSPDFKit instance (if any).

    (async function () {
      PSPDFKit = await import("pspdfkit");
      PSPDFKit.unload(container);
      // const downloadButton = {
      //   type: "custom",
      //   id: "download-pdf",
      //   // icon: "/download.svg",
      //   title: "Download",
      //   onPress: () => {
      //     instance.exportPDF().then((buffer) => {
      //       const blob = new Blob([buffer], { type: "application/pdf" });
      //       const fileName = "document.pdf";
      //       if (window.navigator.msSaveOrOpenBlob) {
      //         window.navigator.msSaveOrOpenBlob(blob, fileName);
      //       } else {
      //         const objectUrl = URL.createObjectURL(blob);
      //         const a = document.createElement("a");
      //         a.href = objectUrl;
      //         a.style = "display: none";
      //         a.download = fileName;
      //         document.body.appendChild(a);
      //         a.click();
      //         URL.revokeObjectURL(objectUrl);
      //         document.body.removeChild(a);
      //       }
      //     });
      //   },
      // };
      // const items = PSPDFKit.defaultToolbarItems;
      // items.push(downloadButton);
      console.log("blob000", props.document);
      await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        // toolbarItems: items,
        container,
        // The document to open.
        document: props.document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
        autoSaveMode: PSPDFKit.AutoSaveMode.IMMEDIATE,
      })
        .then(async (_instance) => {
          console.log("instance===", instance);
          instance = _instance;
        })
        .catch((err) => {
          console.log("err", err);
        });
      const arrayBuffer = await instance?.exportPDF();
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      console.log("blob==bbb", blob);
      // setState(blob);
      instance?.addEventListener("document.saveStateChange", (event) => {
        console.log(`Save state changed: ${event.hasUnsavedChanges}`);
      });
      instance?.save();
      console.log("ali", instance.save);
      const formData = new FormData();
      formData.append("file", blob);
      await fetch("/upload", {
        method: "POST",
        body: formData,
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [props.document]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
