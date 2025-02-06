{
  description = "Clipper - Browser-based video editor";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
            nodePackages.typescript
            nodePackages.typescript-language-server

            # Development tools
            nil # Nix LSP
            nixpkgs-fmt
          ];

          shellHook = ''
            echo "Clipper development environment"
            echo "Node.js version: $(node --version)"
            echo "npm version: $(npm --version)"
          '';
        };
      }
    );
}
