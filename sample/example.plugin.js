export default function() {
  console.log('Hello example plugin');

  return function() {
    console.log('Hello example plugin called');
  };
}
