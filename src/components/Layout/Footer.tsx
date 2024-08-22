import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 Free Pass Porter.</p>
      <p>Open to contribution <FaGithub /></p>
      <p>Made with ❤️ by <a href="https://www.linkedin.com/in/lotfi-el-korchi/" target="_blank">elkolotfi <FaExternalLinkAlt /></a></p>
    </footer>
  );
}