import './rdc.css';
import PlanSvg from '../../../assets/rdc.svg';

const Canvas = () => {
    const points = [

        { x: -500, y: 0 },


    ];

    return (
        <div className="canvas-container" style={{ position: 'relative' }}>
            <img src={PlanSvg} alt="Plan" className="plan-svg" />
            {points.map((point, index) => (
                <div
                    key={index}
                    className="point sonar-effect"
                    style={{
                        left: `${point.x}px`,
                        top: `${point.y}px`,
                    }}
                />
            ))}
        </div>
    );
};

export default Canvas;
