import React from 'react';

function ImageUploader({ images, onImageUpload, onImageRemove, loading })
{
    return (
        <div className='form-group mb-4'>
            <label>Images</label>
            <div className="d-flex flex-wrap">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} className="position-relative m-2">
                            <img
                                src={image.url}
                                alt="image"
                                className="img-thumbnail"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                onClick={() => onImageRemove(image.public_id)}
                                disabled={loading}
                                style={{ transform: 'translate(50%, -50%)' }}
                            >
                                &times;
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No images available</p>
                )}
            </div>
            <input
                type='file'
                accept='image/*'
                className='form-control mt-3'
                onChange={(e) => onImageUpload(e.target.files[0])}
                disabled={loading}
            />
        </div>
    );
}

export default ImageUploader;
