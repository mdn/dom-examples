const textarea = document.querySelector("textarea");
const saveBtn = document.querySelector(".save");
const saveList = document.querySelector(".save-list");

// Array to store handles of created files in
let savedFileRefs = [];

// Create a new text file handle
async function getNewFileHandle() {
  const opts = {
    types: [
      {
        description: "Text file",
        accept: { "text/plain": [".txt"] },
      },
    ],
  };
  return await window.showSaveFilePicker(opts);
}

// Write the provided text to the provided file handle
async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();

  // Write the contents of the file to the stream.
  await writable.write(contents);

  // Close the file and write the contents to disk.
  await writable.close();
}

// Update the app and UI to contain details of a new file
async function processNewFile(fileHandle) {
  // Check whether the file the text was written to already exists on
  // disk. If so, don't create a new entry in the app
  for (const handle of savedFileRefs) {
    if (handle.name === fileHandle.name) {
      alert("New text written to existing file");
      return;
    }
  }

  // Push the new file handle onto the array
  savedFileRefs.push(fileHandle);

  // Create a new list item with delete button in the UI
  const listItem = document.createElement("li");
  listItem.textContent = fileHandle.name;
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  // The button id is the file name, with the .txt part removed
  const fileId = fileHandle.name.split(".")[0];
  deleteBtn.id = fileId;
  saveList.appendChild(listItem);
  listItem.appendChild(deleteBtn);

  // Add an event handler to the button so the file is deleted when pressed
  deleteBtn.addEventListener("click", await deleteFile);
}

// Delete a file
async function deleteFile(e) {
  // Walk through each file handle in the array
  for (const handle of savedFileRefs) {
    // When we find a match between a stored handle and the button id
    if (handle.name === e.target.id + ".txt") {
      // Remove the file from the file system
      await handle.remove();
      // remove the file handle reference form the array
      savedFileRefs = savedFileRefs.filter(
        (handle) => handle.name !== e.target.id + ".txt"
      );
      // Delete the corresponding list item from the UI
      e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    }
  }
}

// Pressing the Save file button kicks everything off
saveBtn.addEventListener("click", async () => {
  // If the textarea is not empty
  if (textarea.value !== "") {
    // Create a new file handle
    const fileHandle = await getNewFileHandle();
    // Write the textarea contents to it
    await writeFile(fileHandle, textarea.value);
    // Update the app with the new file details
    await processNewFile(fileHandle);
  }
});
