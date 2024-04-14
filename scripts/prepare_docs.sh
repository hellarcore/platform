# Consolidate package docs into one folder for building documentation
cp -r ./packages/js-hapi-client/docs/ ./docs/HAPI-Client
mv ./docs/HAPI-Client/_sidebar.md ./docs/HAPI-Client/Overview.md
cp -r ./packages/js-hellar-sdk/docs/ ./docs/SDK
mv ./docs/SDK/_sidebar.md ./docs/SDK/Overview.md
# Exclude folder with empty documents
rm -r ./docs/SDK/walkthroughs
cp -r ./packages/wallet-lib/docs/ ./docs/Wallet-library
mv ./docs/Wallet-library/_sidebar.md ./docs/Wallet-library/Overview.md
