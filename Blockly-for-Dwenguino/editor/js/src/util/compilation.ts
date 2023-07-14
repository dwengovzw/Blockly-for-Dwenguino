const compilationPath = globalSettings.hostname + "/utilities/getDwenguinoBinary";

export async function requestCodeCompilation(code: string, localfilename: string): Promise<{ blob: Blob; filename: string }> {
    let url = compilationPath;
    let request: RequestInit = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
    };
    const response = await fetch(url, request);
    if (response.status === 200) {
        const blob = await response.blob();
        // check for a filename
        var filename = "";
        var disposition = response.headers.get("Content-Disposition");
        if (disposition && disposition.indexOf("attachment") !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, "");
        }
        if (filename === "error.log") {
            let errorInfo = JSON.parse(await blob.text());
            throw new Error(errorInfo);
        } else {
            if (localfilename !== "") {
                filename = localfilename;
            }
            return {
                blob: blob,
                filename: filename,
            };
        }
    } else {
        throw new Error(response.statusText);
    }
}


export function downloadBlobToFile(blob: Blob, filename: string) {
    // @ts-ignore
    if (typeof window.navigator.msSaveBlob !== "undefined") {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        // @ts-ignore
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);

        if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === "undefined") {
                window.location.href = downloadUrl;
            } else {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            }
        } else {
            window.location.href = downloadUrl;
        }
        setTimeout(function () {
            URL.revokeObjectURL(downloadUrl);
        }, 100); // cleanup
    }
};