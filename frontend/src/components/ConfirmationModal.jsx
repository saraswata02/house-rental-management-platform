import "../styles/confirmationModal.css";

function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText,
    onConfirm,
    onCancel
}) {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="confirmation-modal">

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="modal-actions">

                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-btn"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ConfirmationModal;