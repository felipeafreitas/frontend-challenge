import { Link } from './styles';
import { SiMarketo } from 'react-icons/si';
import { FaCoins } from 'react-icons/fa';
import { VscNotebook } from 'react-icons/vsc';

function TabLink({ children, icon, selected, link }) {
  const svgIcon = () => {
    switch (icon) {
      case 'icon-marketing':
        return <SiMarketo />;
      case 'icon-finance':
        return <FaCoins />;
      case 'icon-people':
        return <VscNotebook />;
      default:
        <></>;
    }
  };

  return (
    <Link selected={selected} href={`/${link}`}>
      {svgIcon()}
      {children}
    </Link>
  );
}

export default TabLink;
