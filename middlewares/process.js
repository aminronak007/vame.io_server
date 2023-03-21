module.exports = {
  process: () => {
    setTimeout(function () {
      process.on("exit", function () {
        require("child_process").spawn(process.argv.shift(), process.argv, {
          cwd: process.cwd(),
          detached: true,
          stdio: "inherit",
        });
      });
      process.exit();
    }, 1000);
  },
};
