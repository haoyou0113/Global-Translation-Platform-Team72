import React, { useState, useEffect, Fragment } from 'react';
import { Typography, Input, Button, Alert, Pagination } from 'antd';
import { NavLink } from 'react-router-dom';
//import { Editor } from 'react-draft-wysiwyg';
//import { EditorState, createWithContent } from 'draft-js';

import { pdfjs } from 'react-pdf';
import { get, post } from '../../../../utils/request';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.css';
import pdf1 from './20 Busy Little Ants.pdf';
import pdf2 from './How The Rooster Found His Sound.pdf';
import pdf3 from './Tahlia The Tortoise Finds An Umbrella.pdf';
import 'draft-js/dist/Draft.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const ReactPDF = require('react-pdf');

const { Title } = Typography;

const Translation = (props) => {
  const purpose = props.location.search.substr(1);
  const [status, setStatus] = useState(false);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [value, setValue] = useState('');
  const [translator, setTranslator] = useState('');
  const [reviewer, setReviewer] = useState('');
  const inforArr = purpose.split('|');
  const [url, setUrl] = useState();

  useEffect(() => {
    const fetchData = async () => {
      get(`http://localhost:8080/api/trans/content?id=${inforArr[0]}`).then(
        (res) => {
          if (res.errno === 0) {
            setValue(`${res.data.name}`);
            if (inforArr[0] === 146) {
              setUrl(pdf1);
            } else if (inforArr[0] === 552) {
              setUrl(pdf2);
            } else {
              setUrl(pdf3);
            }
            if (res.data.trans_content === null) {
              setValue(`${res.data.name}`);
            } else {
              console.log(res.data.trans_content);

              setValue(res.data.trans_content);
            }
          }
        }
      );
    };
    fetchData();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onChangePage = (page) => {
    setPageNumber(page);
  };

  const submit = () => {
    alert('Success Submit');
    post(`http://localhost:8080/api/trans/update`, {
      id: inforArr[0],
      trans_content: value,
      status_info: 'Waiting for approval',
      translation_reviewer_name: reviewer,
      translator_name: translator,
      download_loc: inforArr[2],
    });
  };
  console.log(inforArr[2]);
  return (
    <div style={{ height: '100vh' }} className='translate'>
      <Title level={1}>
        <b>Workbench</b>
      </Title>
      <h1>
        Translation Language <b> {inforArr[1]} </b>to <b>{inforArr[2]}</b>
      </h1>
      <Fragment>
        <ReactPDF.Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          style={{ position: 'absolute', left: '7vw' }}
        >
          <ReactPDF.Page pageNumber={pageNumber} />
          <Pagination
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -90,
              width: 360,
            }}
            total={numPages}
            showTotal={(total) => ` ${total} pages`}
            current={pageNumber}
            pageSize={1}
            size='small'
            onChange={onChangePage}
          />
        </ReactPDF.Document>
      </Fragment>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={setValue}
        style={{
          position: 'absolute',
          background: '#fff',
          height: '70vh',
          width: '50vw',
          right: '2vw',
        }}
      />
      <Alert
        style={{ display: status ? 'block' : 'none' }}
        message='Success Text'
        description='Success Description Success Description Success Description'
        type='success'
      />

      <div
        style={{
          display: 'flex',
          width: 340,
          position: 'absolute',
          bottom: -30,
          right: '25vw',
        }}
      >
        <label htmlFor=' ' style={{ marginRight: 20 }}>
          Reviewer Signature
          <Input
            placeholder='Reviewer name '
            allowClear
            onChange={(e) => setReviewer(e.target.value)}
          />
        </label>
        <label htmlFor=''>
          {' '}
          Translator Signature{' '}
          <Input
            placeholder='Translator name '
            allowClear
            onChange={(e) => setTranslator(e.target.value)}
          />
        </label>
      </div>
      <div style={{ position: 'absolute', right: '3vw', bottom: '10vh' }}>
        <Button onClick={submit}>
          <NavLink to='/home/main'>Submit </NavLink>
        </Button>
      </div>
    </div>
  );
};

export default Translation;
