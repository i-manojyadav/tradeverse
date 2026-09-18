import './EmptyState.css';

function EmptyState({ title }) {
    return (
        <div className='empty-state'>
            <i className="fa-solid fa-file-circle-xmark"></i>
            <h2>{title}</h2>
            <p>Place your first order from watchlist</p>
        </div>
    )
}


export default EmptyState;