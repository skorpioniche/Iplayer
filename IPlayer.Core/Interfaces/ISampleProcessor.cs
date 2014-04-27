using HoloDB;

namespace IntellectualPlayer.Core
{
    public interface ISampleProcessor
    {
        void Process(Audio item, AudioInfo info);
    }
}
