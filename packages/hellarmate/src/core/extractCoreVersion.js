export default function extractCoreVersion(subversion) {
  return subversion.replace(/\/|\(.*?\)|Hellar Core:/g, '').replace(/\/|\(.*?\)/g, '');
}
