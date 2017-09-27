var React = require('react');

var Topology = React.createClass({
  DEFAULT_DELTA: '...',

  getInitialState: function() {
    return { delta: this.DEFAULT_DELTA };
  },
  processDeltas: function(deltas) {
    var healthyPartitions = 0,
        unhealthyPartitions = 0,
        totalDelta = 0;

    deltas.forEach(function(delta) {
      var storm = delta.storm;
      if ( storm === null ) {
        unhealthyPartitions++;
        storm = 0;
      } else {
        healthyPartitions++;
      }
      var partitionDelta = delta.current - storm;
      totalDelta += partitionDelta
    });

    this.setState({ delta: totalDelta, healthy: healthyPartitions, unhealthy: unhealthyPartitions, error: false, message: '' });
  },
  refreshDelta: function() {
    var r = new XMLHttpRequest();
    var query = "topic=" + this.props.topic + "&toporoot=" + this.props.root;
    r.open("GET", "/api/status?" + query, true);
    r.onreadystatechange = function () {
      if ( r.readyState != 4 ) { return; }
      if ( r.status == 500 ) {
        this.setState({ delta: this.DEFAULT_DELTA, error: true, message: 'Capillary returned a 500 error. Check ZK configuration?' });
        return;
      }
      try {
        this.processDeltas(JSON.parse(r.responseText));
      }
      catch(err) {
        console.error(err);
        this.setState({ delta: this.DEFAULT_DELTA, error: true, message: r.responseText });
      }
    }.bind(this);
    r.send()
  },
  componentWillMount: function() {
    //this.refreshTimer = window.setInterval(this.refreshDelta, this.props.refreshInterval);
    this.refreshDelta();
  },
  componentWillUnmount: function() {
    if ( this.refreshTimer ) {
      window.clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  },

  render: function() {
    var classes = [];
    if ( this.state.error ) {
      classes.push('danger');
    }

    var url = "/topo?name=" + this.props.name + "&toporoot=" + this.props.root + "&topic=" + this.props.topic;
    var consumer = "/consumer?name=" +this.props.root;
    return (
      <tr className={classes.join(' ')}>
        <td><a href={url}>{ this.props.name }</a></td>
        <td>{ this.state.delta }</td>
        <td>{ this.props.topic }</td>
        <td><a href={consumer}>{ this.props.root}</a></td>
      </tr>
    );
  }
});

module.exports = Topology;
