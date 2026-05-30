"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Link,
  List,
  Heading,
  BlockQuote,
  Image,
  ImageUpload,
  ImageInsert,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageTextAlternative,
  ImageResize,
  FileRepository,
  Table,
  TableToolbar,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function UploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => ({
    async upload() {
      const file = await loader.file;
      const formData = new FormData();
      formData.append("upload", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      return {
        default: data.url,
      };
    },
    abort() {},
  });
}

export default function PostEditorClient({ value, onChange }: Props) {
  return (
    <div className="wp-editor rounded-xl border bg-white">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          plugins: [
            Essentials,
            Paragraph,
            Bold,
            Italic,
            Link,
            List,
            Heading,
            BlockQuote,
            Image,
            ImageUpload,
            ImageInsert,
            ImageToolbar,
            ImageCaption,
            ImageStyle,
            ImageTextAlternative,
            ImageResize,
            FileRepository,
            Table,
            TableToolbar,
            Undo,
            UploadAdapterPlugin,
          ],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
          image: {
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        }}
        onChange={(_, editor) => onChange(editor.getData())}
      />
    </div>
  );
}