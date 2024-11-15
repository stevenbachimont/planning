import './plans.css';
import RDC from '../../../assets/rdc.svg';
import R1 from '../../../assets/r+1.svg';

const Canvas = ({ pointPosition, room }) => {
    const getImageForRoom = (room) => {
        switch (room) {
            case '49':
                return RDC;
            case '131':
                return R1;
            default:
                return RDC;
        }
    };

    return (
        <div className="canvas-container" style={{ position: 'relative' }}>
            <img src={getImageForRoom(room)} alt="Plan" className="plan-svg" />
            <div
                className="point sonar-effect"
                style={{
                    left: `${pointPosition.x}px`,
                    top: `${pointPosition.y}px`,
                }}
            />
        </div>
    );
};

export default Canvas;
