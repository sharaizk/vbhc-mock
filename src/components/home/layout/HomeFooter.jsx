const HomeFooter = ({user}) => {
  return (
    <footer className="home-foot">
      <span>VBHC · v0.6 build 2026.04.12</span>
      <span className="sep">·</span>
      <span>
        Acting as <code>{user.role}</code> at <code>CNHI</code>
      </span>
      <span className="sep">·</span>
      <span>
        Data source <code>vbhc-ops-prod</code>
      </span>
    </footer>
  );
};

export default HomeFooter;
