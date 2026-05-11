function HomeHeader({ user }) {
  return (
    <div className="page-head home-head">
      <div>
        <div className="crumb">Home · Operational Command Center</div>
        <h1>Good morning, Hala.</h1>
        <p className="desc">
          Five contracts live across the network. Two are below the at-risk
          line; one settlement closes in fourteen days. The headlines are below
          — composites, dimensions, and the queue of items waiting on you.
        </p>
      </div>
      <div className="home-head-meta">
        <div className="meta-row">
          <span className="lbl">Acting as</span>
          <span className="val">{user.role}</span>
        </div>
        <div className="meta-row">
          <span className="lbl">Org</span>
          <span className="val">CNHI</span>
        </div>
        <div className="meta-row">
          <span className="lbl">Period</span>
          <span className="val">{user.period}</span>
        </div>
      </div>
    </div>
  );
}

export default HomeHeader;
