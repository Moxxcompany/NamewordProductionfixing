import { fireicon, Polygon1, Polygon2 } from "../common/icons";
import { FaCheck } from "react-icons/fa6";
import { useLanguage } from "../../hooks/useLanguage";

export default function PointsBanner() {
  const { t } = useLanguage();
  return (
    <div className="w-full mx-auto mt-5 point-banner py-3">
        <img src={Polygon1} alt="Polygon1" title="Polygon1" className="polygon1" />
        <img src={Polygon2} alt="Polygon2" title="Polygon2" className="polygon1" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-7xl mx-auto relative z-10">

            {/* Left Section */}
            <div className="flex sm:flex-row flex-col sm:items-center items-end gap-4">
                {/* Icon */}
                <img src={fireicon} alt="fireicon" title="fireicon" />

                {/* Badge + Text */}
                <div className="flex flex-wrap sm:items-center items-end gap-3">
                    <span className="purple-tag">
                        {t.home.pointsBanner.badge}
                    </span>
                    <p className="point-p-text">
                        {t.home.pointsBanner.title}
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <ul className="text-base font-medium">
                {t.home.pointsBanner.bullets.map((item, idx) => (
                    <li className="flex items-center gap-2" key={item + idx}>
                        <FaCheck />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
}
