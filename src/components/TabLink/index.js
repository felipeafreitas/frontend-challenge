import { Button } from './styles';
import { SiMarketo } from 'react-icons/si';
import { FaCoins } from 'react-icons/fa';
import { VscNotebook } from 'react-icons/vsc';
import { Link } from 'react-router-dom';

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
    <Link to={`/${link}`}>
      <Button selected={selected}>
        {svgIcon()}
        {children}
      </Button>
    </Link>
  );
}

export default TabLink;
