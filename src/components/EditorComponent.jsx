import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

import Config from 'src/config/Config';

export default function EditorComponent({ mainContent, setMainContent }) {
  return (
    <Editor
      apiKey={Config.tinymceKey}
      value={mainContent}
      onEditorChange={(e) => setMainContent(e)}
      init={{
        selector: 'textarea#basic-example',
        height: 700,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
      }}
    />
  );
}

EditorComponent.propTypes = {
  mainContent: PropTypes.any.isRequired,
  setMainContent: PropTypes.any.isRequired,
};
