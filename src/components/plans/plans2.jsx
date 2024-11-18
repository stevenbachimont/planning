import './plans.css';
import RDC from '../../../assets/rdc.svg';
import R1 from '../../../assets/r+1.svg';
import R2 from '../../../assets/r+2.svg';
import R3 from '../../../assets/r+3.svg';
import R4 from '../../../assets/r+4.svg';
import PropTypes from 'prop-types';

const Canvas = ({ pointPosition, room }) => {
    const getImageForRoom = (room) => {
        console.log('Room in Canvas:', room);
        const rdcRooms = ['49', '35'];
        const rPlus1Rooms = ['131', '135'];
        const rPlus2Rooms = ['231', '235'];
        const rPlus3Rooms = ['340', '335'];
        const rPlus4Rooms = ['441', '435'];

        if (rdcRooms.includes(room)) {
            return RDC;
        } else if (rPlus1Rooms.includes(room)) {
            return R1;
        } else if (rPlus2Rooms.includes(room)) {
            return R2;
        } else if (rPlus3Rooms.includes(room)) {
            return R3;
        } else if (rPlus4Rooms.includes(room)) {
            return R4;
        } else {
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

Canvas.propTypes = {
    pointPosition: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }).isRequired,
    room: PropTypes.string.isRequired,
};

export default Canvas;