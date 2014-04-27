using IntellectualPlayer.Core;
using HoloDB;

namespace IntellectualPlayer.Processing
{
    public static class AudioExtensions
    {
        public static SHA1Hash GetHash(this Audio source)
        {
            return source.GetData<SHA1HashDescriptor>().Hash;
        }
    }
}
