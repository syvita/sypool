import Link from 'next/link';

const JoinSypoolButton = (props) => {
  return (
    <Link href="/join">
      <button>{props.name}</button>
    </Link>
  );
};

export default JoinSypoolButton;
