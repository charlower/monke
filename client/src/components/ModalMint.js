import { useRef, useEffect, useState } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useModal } from '../slices/modalSlice';
import { useLoading } from '../slices/loadingSlice';
import { useIpfs } from '../slices/ipfsSlice';
import { useAuth } from '../slices/authSlice';
import { useToast } from '../slices/toastSlice';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { parseUnits } from '@ethersproject/units';
import MonkeMarketplace from '../contracts/ethereum-contracts/MonkeMarketplace.json';
import MonkeNFT from '../contracts/ethereum-contracts/MonkeNFT.json';
import { eth_usd as returnEthUsd } from '../helpers/utilities';

import watermark from '../img/monke-watermark.svg';

export const ModalMint = () => {
  const modalRef = useRef();
  const fileRef = useRef();
  const context = useWeb3React();
  const { account, library, connector, active } = context;
  const { modalToggle, modalShowing } = useModal();
  const { setLoadingData, loadingData } = useLoading();
  const { setIpfs, ipfsResponse } = useIpfs();
  const { setToastMessage } = useToast();
  const { token } = useAuth();
  let history = useHistory();

  const { networks, abi } = MonkeMarketplace;
  const { networks: networksNFT, abi: abiNFT } = MonkeNFT;

  const [uploadData, setUploadData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [formInputs, setFormInputs] = useState({
    title: '',
    description: '',
    nftCost: '',
    tags: [],
    tagInput: '',
  });
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [ethUsd, setEthUsd] = useState(0);
  const [MonkeNFTContract, setMonkeNFTContract] = useState();

  const toggleModal = () => {
    const payload = {
      status: null,
      data: {},
    };
    modalToggle();
    setIpfs(payload);
    clearForm();
  };

  const preventSubmit = (e) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const getFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setFileName(file.name);
    setFileType(file.type);
    setPreviewImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('file', file);
    setUploadData(formData);
  };

  useEffect(() => {
    if (active && account) {
      (async function () {
        const signer = await library.getSigner();
        const chainId = await connector.getChainId();
        const marketNetworkId = await networks[parseInt(chainId)].address;
        const nftNetworkId = await networksNFT[parseInt(chainId)].address;

        const M1 = new Contract(marketNetworkId, abi, signer);
        const NFT1 = new Contract(nftNetworkId, abiNFT, signer);

        const listingFee = await M1.getListingFee();
        const listPrice = parseUnits(Number(1).toString(), 'ether');
        await NFT1.on('NFTMinted', async (event) => {
          setToastMessage(
            'NFT Eligible. Please confirm the contract interaction to mint.'
          );
          const tokenId = event._hex;
          await list(tokenId, listingFee, listPrice, M1, chainId);
        });

        setMonkeNFTContract(NFT1);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const list = async (tokenId, listingFee, listPrice, M1, chainId) => {
    try {
      await M1.listNft(
        networksNFT[parseInt(chainId)].address,
        tokenId,
        listPrice,
        {
          value: listingFee,
        }
      );
      setToastMessage('NFT Minted.');
      const payload = {
        status: 200,
        data: 'NFT Successfully minted.',
      };
      setIpfs(payload);
      setLoadingData();
    } catch (err) {
      //TODO: finish error handle need to delet file if not minted
      console.log('error', err);
      setToastMessage('');
      setLoadingData();
    }
  };

  const uploadIpfs = async (e) => {
    // Need to create formInputData (it removes the tagInput key/value which we dont
    // want to send to server)
    if (!token) {
      return;
    }
    const formInputData = (({
      title,
      description,
      nftCost,
      stakeToken,
      tags,
    }) => ({
      title,
      description,
      nftCost,
      stakeToken,
      tags,
    }))(formInputs);
    // Check if formInputData is already appended to form, otherwise it will just keep
    // adding new formInputData objects
    const formInputDataAppended = uploadData.get('formInputData');
    if (formInputDataAppended) {
      uploadData.delete('formInputData');
    }

    uploadData.append('formInputData', JSON.stringify(formInputData));
    uploadData.append('walletAddress', account);
    uploadData.append('type', fileType);

    e.preventDefault();
    try {
      if (active && account) {
        setToastMessage('Preparing NFT, please wait.');
        setLoadingData();
        const res = await axios.post('/api/v1/ipfs/upload_file', uploadData);
        const { ipfsHash, _id } = res.data.success;
        const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        try {
          await MonkeNFTContract.mint(url);
        } catch (err) {
          console.log('error', err);
          await axios.post('/api/v1/content/delete_file', {
            id: _id,
          });
          const payload = {
            status: 500,
            data: 'Transaction rejected.',
          };
          setIpfs(payload);
          setToastMessage('');
          setLoadingData();
        }
      }
    } catch (err) {
      const nftExists =
        err?.response?.data.message === 'duplicate content detected';
      const returnErrorMsg = () => {
        if (nftExists) return 'This content already exists in MONKE as an NFT.';
        else
          return 'Sorry, something went wrong. Our devs have been notified. Please try again later.';
      };
      const payload = {
        status: 500,
        data: returnErrorMsg(),
      };
      setIpfs(payload);
      setToastMessage('');
      setLoadingData();
    }
  };

  // Tag handling
  const tagOnChange = (e) => {
    if (formInputs.tags.length > 2) {
      return false;
    }
    const { value } = e.target;
    setFormInputs({ ...formInputs, tagInput: value });
  };

  const tagOnKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = formInputs.tagInput.trim();
    if (
      (key === ',' &&
        trimmedInput.length &&
        !formInputs.tags.includes(trimmedInput)) ||
      (key === 'Enter' &&
        trimmedInput.length &&
        !formInputs.tags.includes(trimmedInput))
    ) {
      e.preventDefault();
      const newState = {
        ...formInputs,
        tags: [...formInputs.tags, trimmedInput],
        tagInput: '',
      };
      setFormInputs(newState);
    } else if (key === 'Enter') {
      e.preventDefault();
    }

    if (
      key === 'Backspace' &&
      !formInputs.tagInput.length &&
      formInputs.tags.length &&
      isKeyReleased
    ) {
      const tagsCopy = [...formInputs.tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setFormInputs((prevState) => ({
        ...prevState,
        tags: tagsCopy,
        tagInput: poppedTag,
      }));
    }
    setIsKeyReleased(false);
  };

  const tagOnKeyUp = () => {
    setIsKeyReleased(true);
  };

  const tagDelete = (index) => {
    setFormInputs((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag, i) => i !== index),
    }));
  };
  // End tag handling

  const clearForm = () => {
    setFormInputs({
      title: '',
      description: '',
      nftCost: '',
      tags: [],
      tagInput: '',
    });
    setUploadData(null);
    setPreviewImage(null);
  };

  // Toggle Modal
  useEffect(() => {
    const myModal = modalRef.current;
    let bsModal = Modal.getInstance(myModal);
    if (!bsModal) {
      // initialize Modal
      bsModal = new Modal(myModal, { backdrop: 'static' });
      // hide after init
      bsModal.hide();
    } else {
      // toggle
      modalShowing ? bsModal.show() : bsModal.hide();
    }
  });

  // Make sure that relevant form fields have values, and file is uploaded.
  let validateObject = (({ title, description, nftCost, stakeToken }) => ({
    title,
    description,
    nftCost,
    stakeToken,
  }))(formInputs);
  const notValidated =
    Object.values(validateObject).indexOf(null) > -1 ||
    Object.values(validateObject).indexOf('') > -1 ||
    uploadData === null;

  useEffect(() => {
    (async function () {
      const eth_usd = await returnEthUsd();

      setEthUsd(eth_usd.data.data.rates.USD);
    })();
  }, []);

  return (
    <div ref={modalRef} className='modal fade'>
      <div className='modal-dialog modal-dialog-centered modal-fullscreen-sm-down'>
        <div
          className='modal-content bg-view-dark'
          style={{ boxShadow: 'rgba(255, 255, 255, 0.03) 0px 10px 30px 0px' }}
        >
          <div
            className='modal-header bg-dark'
            style={{ borderBottomColor: 'rgba(0, 0, 0, 0.88)' }}
          >
            <h5 className='modal-title text-white-50'>Mint NFT</h5>
            <button
              disabled={loadingData}
              type='button'
              className='btn-close btn-close-white'
              onClick={toggleModal}
              aria-label='Close'
            ></button>
          </div>
          <div
            style={{ backgroundColor: 'rgb(29, 32, 40)' }}
            className='modal-body pb-1 border-0'
          >
            {/* 
            ///////////////
            Start form 
            ///////////////
          */}
            {/* TODO: // get comments */}
            <form
              id='mint_nft_form'
              onSubmit={(e) => {
                uploadIpfs(e);
                e.preventDefault();
              }}
            >
              <div className='w-100'>
                <div
                  className={
                    !uploadData ? 'image-upload-wrap d-flex' : 'image-uploaded'
                  }
                >
                  <input
                    className='file-upload-input'
                    type='file'
                    ref={fileRef}
                    onChange={getFile}
                    accept='.jpg, .jpeg, .png, .bmp, .gif, .webm'
                  />
                  <div
                    style={{
                      minHeight: 200,
                      background: `rgba(0, 0, 0, 0) url(${watermark}) no-repeat center/contain`,
                    }}
                    className='d-flex w-100'
                  >
                    {uploadData ? (
                      <img
                        style={{ maxWidth: '100%', maxHeight: 200 }}
                        src={previewImage}
                        alt={'File: ' + fileName + '  ready!'}
                        className='m-auto d-block text-white'
                      />
                    ) : (
                      <h5 className='text-center align-middle text-white-50 align-self-center mx-auto'>
                        Drag and drop, or upload file
                      </h5>
                    )}
                  </div>
                </div>
                {uploadData ? (
                  <button
                    className='btn btn-bg btn-sm w-100 btn-outline-light my-3'
                    type='button'
                    onClick={() => fileRef.current.click()}
                  >
                    Change
                  </button>
                ) : (
                  <button
                    className='btn btn-bg btn-sm w-100 btn-outline-light my-3'
                    disabled={loadingData}
                    type='button'
                    onClick={() => fileRef.current.click()}
                  >
                    Browse
                  </button>
                )}
              </div>
              {/* 
              ///////////////
              Start inputs 
              ///////////////
              */}
              <div className='form-floating mb-3'>
                <input
                  className='form-control text-light'
                  value={formInputs.title}
                  id='titleInput'
                  placeholder='MONKE'
                  onKeyPress={preventSubmit}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, title: e.target.value })
                  }
                  style={{
                    backgroundColor: 'rgb(29, 32, 40)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }}
                />
                <label className='text-white-50' htmlFor='titleInput'>
                  Title
                </label>
              </div>
              <div className='form-floating mb-3'>
                <input
                  className='form-control text-light'
                  value={formInputs.description}
                  id='descriptionInput'
                  placeholder='Description'
                  onKeyPress={preventSubmit}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      description: e.target.value,
                    })
                  }
                  style={{
                    backgroundColor: 'rgb(29, 32, 40)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }}
                />
                <label className='text-white-50' htmlFor='descriptionInput'>
                  Description
                </label>
              </div>
              <div className='form-floating mb-3'>
                {/*
                ///////////////
                Tag input 
                ///////////////
                */}
                <div
                  style={{ border: '1px solid rgba(255, 255, 255, 0.5)' }}
                  className='d-flex p-2 rounded overflow-scroll'
                >
                  {formInputs.tags.map((tag, index) => (
                    <span
                      key={`${index}-id`}
                      style={{
                        whiteSpace: 'nowrap',
                        padding: 7,
                      }}
                      className='badge bg-success-pink text-dark mx-1 d-flex'
                    >
                      {tag}
                      <svg
                        onClick={() => tagDelete(index)}
                        xmlns='http://www.w3.org/2000/svg'
                        width='12'
                        height='12'
                        fill='currentColor'
                        className='bi bi-x-circle-fill ms-1 tag'
                        viewBox='0 0 16 16'
                      >
                        <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z' />
                      </svg>
                    </span>
                  ))}
                  <input
                    className='w-100 mw-50 border-0 bg-transparent text-light tag-input'
                    value={formInputs.tagInput}
                    placeholder={
                      formInputs.tags.length > 2 ? 'Max of 3' : 'Enter tags'
                    }
                    onKeyDown={tagOnKeyDown}
                    onKeyUp={tagOnKeyUp}
                    onChange={tagOnChange}
                  />
                </div>
                <small className='text-white-50 fw-lighter mx-1'>
                  Use comma / return to seperate tags, maximum of 3 tags.
                </small>
                {/*
                ///////////////
                End tag input 
                ///////////////
                */}
              </div>
              <div className='form-floating mb-1 overflow-hidden'>
                <input
                  className='form-control text-light'
                  id='nftCostInput'
                  value={formInputs.nftCost}
                  placeholder='0'
                  onKeyPress={preventSubmit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setFormInputs({
                      ...formInputs,
                      nftCost: val,
                    });
                  }}
                  style={{
                    backgroundColor: 'rgb(29, 32, 40)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }}
                />
                <label className='text-white-50' htmlFor='nftCostInput'>
                  NFT cost (ETH)
                </label>
                <small className='text-white-50 fw-lighter mx-1'>
                  List NFT for ~$USD{' '}
                  {ethUsd > 0 && formInputs.nftCost !== ''
                    ? Number(ethUsd * formInputs.nftCost).toLocaleString()
                    : '...'}
                </small>
              </div>
            </form>
            {/* 
            ///////////////
            End form 
            ///////////////
          */}
          </div>
          {/* 
          ///////////////
           Error UI handling
          ///////////////
          */}
          {ipfsResponse.status === 500 && (
            <p
              className='text-center pt-0 mb-0 p-2 text-warning'
              style={{ backgroundColor: 'rgb(29, 32, 40)' }}
            >
              {ipfsResponse.data}
            </p>
          )}
          {!token && (
            <p
              className='text-center pt-0 mb-0 pb-1 text-warning'
              style={{ backgroundColor: 'rgb(29, 32, 40)' }}
            >
              Connect with Metamask to mint NFT's.
            </p>
          )}
          {/* 
          ///////////////
           Success UI handling
          ///////////////
          */}
          {ipfsResponse.status === 200 && (
            <div style={{ backgroundColor: 'rgb(29, 32, 40)' }}>
              <p
                className='text-center mb-0 p-2 text-light'
                style={{ backgroundColor: 'rgb(29, 32, 40)' }}
              >
                {ipfsResponse.data}
              </p>
              <button
                className='btn btn-outline-success-pink btn-sm m-auto d-block'
                style={{ zIndex: 2 }}
                onClick={() => {
                  history.push('/');
                  modalToggle();
                }}
              >
                <span>View feed</span>
              </button>
            </div>
          )}
          <div
            style={{ backgroundColor: 'rgb(29, 32, 40)' }}
            className='modal-footer border-0'
          >
            <button
              type='button'
              className={
                loadingData
                  ? 'btn btn-sm btn-outline-light disabled'
                  : 'btn btn-sm btn-outline-light'
              }
              onClick={toggleModal}
            >
              Close
            </button>
            {!loadingData ? (
              <button
                onClick={(e) => {
                  uploadIpfs(e);
                }}
                form='mint_nft_form'
                disabled={
                  !token ||
                  notValidated ||
                  ipfsResponse.status === 200 ||
                  ipfsResponse.status === 500
                }
                className='
   
                    btn btn-sm btn-outline-success-pink'
              >
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    fill='currentColor'
                    className='bi bi-cloud-plus me-1'
                    viewBox='0 0 16 16'
                    style={{ marginTop: -2 }}
                  >
                    <path
                      fillRule='evenodd'
                      d='M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z'
                    />
                    <path d='M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z' />
                  </svg>
                  <span>Mint</span>
                </div>
              </button>
            ) : (
              <button
                form='mint_nft_form'
                className='disabled btn btn-sm btn-outline-success-pink'
              >
                <div>
                  <div
                    className='spinner-border spinner-border-sm text-success-pink me-1'
                    role='status'
                    style={{ marginTop: -1 }}
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                  <span>Minting</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
