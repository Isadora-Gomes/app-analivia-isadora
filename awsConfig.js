// Isadora Gomes da Silva
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "ASIAXGSRW6PNSGROJYRV",
  secretAccessKey: "McvBCS+rDcpZhZNdE7f/QXiluJAm7iVrKuT7Bdlw",
  sessionToken: "IQoJb3JpZ2luX2VjEEQaCXVzLXdlc3QtMiJHMEUCIQDTn9UQg9qYpaKqQ6rstB010z0NlXjj2zNLQti+7TTMwQIgWySQWpz8BWIDakLL9ZI5myHW+bmYAShrcKmN8/tAjs8quAII7P//////////ARABGgw0OTUxNjYzNTQzOTUiDK8spNoyOmPYOL+4GiqMAsLdK+0R2EbsJnDjce0ILenE3Tbpfj9oWwCytkhbYAwyWFE8Gla9T2R+YsN+nlcpSW6nR08FCfTHxw8ZCP3Lvrlc97fTtBO/eL+WomwZ7rDXYGrY3xgwhBbjNLRytZ+tCJz5PbKJrbobHkO7VSuBEXCXkE9noLocY2mb1mlgnFVdobnEact3Lgxtc0+ybWAXikxTv+37P/sVO6H5QBjTWFuO57ZY7RluEHqH50yjMx0ivKg4n7RPbb6bB7ZEntFdNWZf/Dwrs4R9V9GwWQpEUtDKZgY76KlanMvbHN6sluw+wM7hTWaZf7EyCS5DBRnG7jgxAVClCFUPJsuhvx3Altf095tznZy8Fm71cukwgNWMwQY6nQF37I/9qy15SxENncpjNNavg+1bIaOBQO5K465B0Dg/WK71mWRwiRpgRU0zuAkWd2sZPY2Ag7f7UopND21D6cicKGk8tby8ZFSZChbkv2RAc82jzPL8HeoF6qEAP9C5p69H3HKFvdg6MjhNsUD5XrLnyc5DBUY+F+CSdhv3E7us82Kv6B4MX2Ls9YYoN9sVl9NPbOwFDLkpIstbRkRi",
  region: "us-east-1",
});

const s3 = new AWS.S3();

export default s3;
